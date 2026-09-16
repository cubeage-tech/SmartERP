package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.cashflow.CashFlowResponse;
import com.cubeage.erp.finance.dto.cashflow.MonthlyCashFlowDto;
import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.entity.JournalEntry;
import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.repository.JournalEntryRepository;
import com.cubeage.erp.finance.service.AccountService;
import com.cubeage.erp.finance.service.CashFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CashFlowServiceImpl implements CashFlowService {

	private final JournalEntryRepository journalEntryRepository;
	private final AccountRepository accountRepository;
	private final AccountService accountService;

	@Override
	public CashFlowResponse getCashFlow(Long tenantId, Integer year) {
		accountService.initDefaultAccountsIfEmpty(tenantId);

		int targetYear = (year != null && year > 1900 && year < 2100) ? year : LocalDate.now().getYear();

		List<JournalEntry> entries = journalEntryRepository
				.findByTenantIdAndStatusOrderByEntryDateAscIdAsc(tenantId, JournalStatus.POSTED);

		Map<String, Account> accountMap = accountRepository.findByTenantIdOrderByIdAsc(tenantId).stream()
				.collect(Collectors.toMap(Account::getCode, a -> a, (a, b) -> a));

		Map<Integer, MonthlyBucket> buckets = new LinkedHashMap<>();
		for (int m = 1; m <= 12; m++) {
			buckets.put(m, new MonthlyBucket(m, targetYear));
		}

		BigDecimal openingCash = BigDecimal.ZERO;

		for (JournalEntry entry : entries) {
			if (entry.getEntryDate() == null) continue;

			List<JournalEntryLine> lines = entry.getLines();
			if (lines == null || lines.isEmpty()) continue;

			BigDecimal entryCashDebit = BigDecimal.ZERO;
			BigDecimal entryCashCredit = BigDecimal.ZERO;
			List<JournalEntryLine> nonCashLines = new ArrayList<>();

			for (JournalEntryLine line : lines) {
				if (isCashOrBankAccount(line.getAccountCode(), line.getAccountName(), accountMap)) {
					if (line.getDebit() != null) entryCashDebit = entryCashDebit.add(line.getDebit());
					if (line.getCredit() != null) entryCashCredit = entryCashCredit.add(line.getCredit());
				} else {
					nonCashLines.add(line);
				}
			}

			BigDecimal entryNetCash = entryCashDebit.subtract(entryCashCredit);
			if (entryNetCash.signum() == 0) {
				continue;
			}

			if (entry.getEntryDate().getYear() < targetYear) {
				openingCash = openingCash.add(entryNetCash);
				continue;
			}

			if (entry.getEntryDate().getYear() == targetYear) {
				int monthValue = entry.getEntryDate().getMonthValue();
				MonthlyBucket bucket = buckets.get(monthValue);
				if (bucket != null) {
					CashFlowCategory category = classifyCashFlow(nonCashLines, accountMap);
					switch (category) {
						case INVESTING -> bucket.investing = bucket.investing.add(entryNetCash);
						case FINANCING -> bucket.financing = bucket.financing.add(entryNetCash);
						case OPERATING -> bucket.operating = bucket.operating.add(entryNetCash);
					}
					bucket.net = bucket.net.add(entryNetCash);
				}
			}
		}

		List<MonthlyCashFlowDto> monthlyDtos = new ArrayList<>();
		BigDecimal totalOperating = BigDecimal.ZERO;
		BigDecimal totalInvesting = BigDecimal.ZERO;
		BigDecimal totalFinancing = BigDecimal.ZERO;
		BigDecimal totalNetCash = BigDecimal.ZERO;

		for (MonthlyBucket b : buckets.values()) {
			monthlyDtos.add(new MonthlyCashFlowDto(
					b.monthName,
					b.year,
					b.operating,
					b.investing,
					b.financing,
					b.net
			));
			totalOperating = totalOperating.add(b.operating);
			totalInvesting = totalInvesting.add(b.investing);
			totalFinancing = totalFinancing.add(b.financing);
			totalNetCash = totalNetCash.add(b.net);
		}

		BigDecimal closingCash = openingCash.add(totalNetCash);

		return new CashFlowResponse(
				monthlyDtos,
				totalOperating,
				totalInvesting,
				totalFinancing,
				totalNetCash,
				openingCash,
				closingCash
		);
	}

	private boolean isCashOrBankAccount(String code, String name, Map<String, Account> accountMap) {
		String trimmedCode = (code != null) ? code.trim() : "";
		Account account = accountMap.get(trimmedCode);

		// 1. If account is registered, only ASSET accounts can qualify as cash/bank
		if (account != null && account.getType() != AccountType.ASSET) {
			return false;
		}

		String lowerName = (name != null) ? name.toLowerCase(Locale.ROOT) : "";

		// 2. Explicit exclusions: Non-cash asset categories must NEVER be classified as cash/bank
		// - Fixed Assets / Property / Plant / Equipment / Hardware (15xx..19xx or related keywords)
		if (trimmedCode.startsWith("15") || trimmedCode.startsWith("16") || trimmedCode.startsWith("17")
				|| trimmedCode.startsWith("18") || trimmedCode.startsWith("19")
				|| lowerName.contains("property") || lowerName.contains("equipment") || lowerName.contains("hardware")
				|| lowerName.contains("machinery") || lowerName.contains("building") || lowerName.contains("land")
				|| lowerName.contains("vehicle") || lowerName.contains("furniture") || lowerName.contains("fixture")) {
			return false;
		}

		// - Receivables / Debtors (11xx or related keywords)
		if (trimmedCode.startsWith("11") || lowerName.contains("receivable") || lowerName.contains("debtor")) {
			return false;
		}

		// - Inventory / Stock (12xx or related keywords)
		if (trimmedCode.startsWith("12") || lowerName.contains("inventory") || lowerName.contains("stock") || lowerName.contains("material")) {
			return false;
		}

		// - Prepaid Expenses / Advances (14xx or related keywords)
		if (trimmedCode.startsWith("14") || lowerName.contains("prepaid") || lowerName.contains("advance")) {
			return false;
		}

		// 3. Positive Cash/Bank classification:
		// Standard Chart of Accounts Cash & Cash Equivalents block: 1000..1099 (code starts with "10")
		if (trimmedCode.startsWith("10")) {
			return true;
		}

		// 4. Exact banking/cash account phrases for custom non-standard codes
		return lowerName.equals("cash")
				|| lowerName.equals("bank")
				|| lowerName.startsWith("cash in ")
				|| lowerName.startsWith("cash at ")
				|| lowerName.startsWith("petty cash")
				|| lowerName.contains("bank account")
				|| lowerName.contains("cash account")
				|| lowerName.contains("checking account")
				|| lowerName.contains("savings account")
				|| lowerName.contains("current account")
				|| lowerName.matches(".*\\b(hdfc|sbi|icici|axis|pnb|citi|hsbc)\\s+(bank|account)?.*");
	}

	private CashFlowCategory classifyCashFlow(List<JournalEntryLine> nonCashLines, Map<String, Account> accountMap) {
		for (JournalEntryLine line : nonCashLines) {
			String code = (line.getAccountCode() != null) ? line.getAccountCode().trim() : "";
			String name = (line.getAccountName() != null) ? line.getAccountName().toLowerCase(Locale.ROOT) : "";
			Account account = accountMap.get(code);

			// Investing: Fixed Assets (Asset accounts with code 15xx or fixed asset keywords)
			boolean isAssetType = account == null || account.getType() == AccountType.ASSET;
			if (isAssetType && (code.startsWith("15") || name.contains("asset") || name.contains("equipment")
					|| name.contains("machinery") || name.contains("vehicle") || name.contains("investment"))) {
				return CashFlowCategory.INVESTING;
			}

			// Financing: Equity, Capital, Loans, Borrowings, Debentures, Dividends
			boolean isFinancingType = account != null && (account.getType() == AccountType.EQUITY || account.getType() == AccountType.LIABILITY);
			if ((isFinancingType && (code.startsWith("25") || code.startsWith("30")))
					|| name.contains("equity") || name.contains("capital") || name.contains("loan")
					|| name.contains("borrowing") || name.contains("dividend")) {
				return CashFlowCategory.FINANCING;
			}
		}

		return CashFlowCategory.OPERATING;
	}

	private enum CashFlowCategory {
		OPERATING, INVESTING, FINANCING
	}

	private static class MonthlyBucket {
		final String monthName;
		final int year;
		BigDecimal operating = BigDecimal.ZERO;
		BigDecimal investing = BigDecimal.ZERO;
		BigDecimal financing = BigDecimal.ZERO;
		BigDecimal net = BigDecimal.ZERO;

		MonthlyBucket(int month, int year) {
			this.year = year;
			this.monthName = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase(Locale.ROOT);
		}
	}
}
