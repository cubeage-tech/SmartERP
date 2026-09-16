package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.balancesheet.*;
import com.cubeage.erp.finance.dto.profitloss.ProfitLossResponse;
import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.repository.JournalEntryLineRepository;
import com.cubeage.erp.finance.service.AccountService;
import com.cubeage.erp.finance.service.BalanceSheetService;
import com.cubeage.erp.finance.service.ProfitLossService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BalanceSheetServiceImpl implements BalanceSheetService {

	private final JournalEntryLineRepository lineRepository;
	private final AccountRepository accountRepository;
	private final AccountService accountService;
	private final ProfitLossService profitLossService;

	@Override
	public BalanceSheetResponse getBalanceSheet(Long tenantId, LocalDate asOfDate) {
		LocalDate effectiveAsOf = (asOfDate != null) ? asOfDate : LocalDate.now();
		accountService.initDefaultAccountsIfEmpty(tenantId);

		List<JournalEntryLine> lines = lineRepository.findFilteredPostedLines(
				tenantId, JournalStatus.POSTED, null, null, effectiveAsOf
		);

		Map<String, Account> accountMap = accountRepository.findByTenantIdOrderByIdAsc(tenantId).stream()
				.collect(Collectors.toMap(Account::getCode, a -> a, (a, b) -> a));

		Map<String, AccountAggregator> lineAggregates = new LinkedHashMap<>();
		for (JournalEntryLine line : lines) {
			String code = (line.getAccountCode() != null) ? line.getAccountCode().trim() : "";
			String name = (line.getAccountName() != null) ? line.getAccountName().trim() : "";
			BigDecimal debit = (line.getDebit() != null) ? line.getDebit() : BigDecimal.ZERO;
			BigDecimal credit = (line.getCredit() != null) ? line.getCredit() : BigDecimal.ZERO;

			lineAggregates.computeIfAbsent(code, c -> new AccountAggregator(c, name))
					.add(debit, credit);
		}

		// Ensure all registered accounts exist in the pool
		Set<String> allCodes = new LinkedHashSet<>();
		allCodes.addAll(accountMap.keySet());
		allCodes.addAll(lineAggregates.keySet());

		List<BalanceSheetItemDto> assets = new ArrayList<>();
		List<BalanceSheetItemDto> liabilities = new ArrayList<>();
		List<BalanceSheetItemDto> equity = new ArrayList<>();

		BigDecimal totalAssets = BigDecimal.ZERO;
		BigDecimal totalLiabilities = BigDecimal.ZERO;
		BigDecimal totalEquity = BigDecimal.ZERO;

		for (String code : allCodes) {
			Account account = accountMap.get(code);
			AccountAggregator agg = lineAggregates.get(code);

			BigDecimal totalDebit = (agg != null) ? agg.totalDebit : BigDecimal.ZERO;
			BigDecimal totalCredit = (agg != null) ? agg.totalCredit : BigDecimal.ZERO;

			String name = (account != null) ? account.getName() : (agg != null ? agg.name : code);
			AccountType type = (account != null) ? account.getType() : resolveFallbackType(code, name);

			// Only process balance sheet account types
			if (type == AccountType.ASSET) {
				BigDecimal balance = totalDebit.subtract(totalCredit);
				if (shouldIncludeInReport(account, balance, totalDebit, totalCredit)) {
					String category = resolveAssetCategory(code, name);
					assets.add(new BalanceSheetItemDto(code, name, category, balance));
					totalAssets = totalAssets.add(balance);
				}
			} else if (type == AccountType.LIABILITY) {
				BigDecimal balance = totalCredit.subtract(totalDebit);
				if (shouldIncludeInReport(account, balance, totalDebit, totalCredit)) {
					String category = resolveLiabilityCategory(code, name);
					liabilities.add(new BalanceSheetItemDto(code, name, category, balance));
					totalLiabilities = totalLiabilities.add(balance);
				}
			} else if (type == AccountType.EQUITY) {
				BigDecimal balance = totalCredit.subtract(totalDebit);
				if (shouldIncludeInReport(account, balance, totalDebit, totalCredit)) {
					equity.add(new BalanceSheetItemDto(code, name, "Equity", balance));
					totalEquity = totalEquity.add(balance);
				}
			}
			// REVENUE and EXPENSE accounts are deliberately excluded as they flow into currentPeriodNetProfit
		}

		// Sort items by code
		assets.sort(Comparator.comparing(BalanceSheetItemDto::accountCode));
		liabilities.sort(Comparator.comparing(BalanceSheetItemDto::accountCode));
		equity.sort(Comparator.comparing(BalanceSheetItemDto::accountCode));

		// Calculate Current Period Net Profit from authoritative P&L up to asOfDate
		ProfitLossResponse pnl = profitLossService.getProfitLoss(tenantId, null, effectiveAsOf);
		BigDecimal currentPeriodNetProfit = (pnl != null && pnl.netProfit() != null)
				? pnl.netProfit()
				: BigDecimal.ZERO;

		BigDecimal totalLiabilitiesAndEquity = totalLiabilities.add(totalEquity).add(currentPeriodNetProfit);
		BigDecimal balanceVariance = totalAssets.subtract(totalLiabilitiesAndEquity);
		boolean isBalanced = balanceVariance.compareTo(BigDecimal.ZERO) == 0;

		return new BalanceSheetResponse(
				effectiveAsOf,
				assets,
				totalAssets,
				liabilities,
				totalLiabilities,
				equity,
				totalEquity,
				currentPeriodNetProfit,
				totalLiabilitiesAndEquity,
				balanceVariance,
				isBalanced
		);
	}

	@Override
	public TrialBalanceResponse getTrialBalance(Long tenantId, LocalDate asOfDate) {
		LocalDate effectiveAsOf = (asOfDate != null) ? asOfDate : LocalDate.now();
		accountService.initDefaultAccountsIfEmpty(tenantId);

		List<JournalEntryLine> lines = lineRepository.findFilteredPostedLines(
				tenantId, JournalStatus.POSTED, null, null, effectiveAsOf
		);

		Map<String, Account> accountMap = accountRepository.findByTenantIdOrderByIdAsc(tenantId).stream()
				.collect(Collectors.toMap(Account::getCode, a -> a, (a, b) -> a));

		Map<String, AccountAggregator> lineAggregates = new LinkedHashMap<>();
		for (JournalEntryLine line : lines) {
			String code = (line.getAccountCode() != null) ? line.getAccountCode().trim() : "";
			String name = (line.getAccountName() != null) ? line.getAccountName().trim() : "";
			BigDecimal debit = (line.getDebit() != null) ? line.getDebit() : BigDecimal.ZERO;
			BigDecimal credit = (line.getCredit() != null) ? line.getCredit() : BigDecimal.ZERO;

			lineAggregates.computeIfAbsent(code, c -> new AccountAggregator(c, name))
					.add(debit, credit);
		}

		Set<String> allCodes = new LinkedHashSet<>();
		allCodes.addAll(accountMap.keySet());
		allCodes.addAll(lineAggregates.keySet());

		List<TrialBalanceItemDto> items = new ArrayList<>();
		BigDecimal grandTotalDebit = BigDecimal.ZERO;
		BigDecimal grandTotalCredit = BigDecimal.ZERO;

		for (String code : allCodes) {
			Account account = accountMap.get(code);
			AccountAggregator agg = lineAggregates.get(code);

			BigDecimal totalDebit = (agg != null) ? agg.totalDebit : BigDecimal.ZERO;
			BigDecimal totalCredit = (agg != null) ? agg.totalCredit : BigDecimal.ZERO;

			// Include if account is active or has historical debit/credit movement
			if ((account != null && account.isActive()) || totalDebit.compareTo(BigDecimal.ZERO) > 0 || totalCredit.compareTo(BigDecimal.ZERO) > 0) {
				String name = (account != null) ? account.getName() : (agg != null ? agg.name : code);
				AccountType type = (account != null) ? account.getType() : resolveFallbackType(code, name);

				BigDecimal netDebit = totalDebit.compareTo(totalCredit) > 0 ? totalDebit.subtract(totalCredit) : BigDecimal.ZERO;
				BigDecimal netCredit = totalCredit.compareTo(totalDebit) > 0 ? totalCredit.subtract(totalDebit) : BigDecimal.ZERO;

				items.add(new TrialBalanceItemDto(code, name, type, totalDebit, totalCredit, netDebit, netCredit));

				grandTotalDebit = grandTotalDebit.add(totalDebit);
				grandTotalCredit = grandTotalCredit.add(totalCredit);
			}
		}

		items.sort(Comparator.comparing(TrialBalanceItemDto::accountCode));

		BigDecimal difference = grandTotalDebit.subtract(grandTotalCredit).abs();
		boolean isBalanced = difference.compareTo(BigDecimal.ZERO) == 0;

		return new TrialBalanceResponse(
				effectiveAsOf,
				items,
				grandTotalDebit,
				grandTotalCredit,
				difference,
				isBalanced
		);
	}

	private boolean shouldIncludeInReport(Account account, BigDecimal balance, BigDecimal debit, BigDecimal credit) {
		// Include if account is active OR has non-zero balance OR has posted activity (inactive with historical data)
		boolean hasActivity = debit.compareTo(BigDecimal.ZERO) > 0 || credit.compareTo(BigDecimal.ZERO) > 0;
		boolean hasBalance = balance.compareTo(BigDecimal.ZERO) != 0;
		return (account != null && account.isActive()) || hasActivity || hasBalance;
	}

	private String resolveAssetCategory(String code, String name) {
		String lower = (name != null) ? name.toLowerCase(Locale.ROOT) : "";
		if (code.startsWith("15") || code.startsWith("16") || code.startsWith("17")
				|| code.startsWith("18") || code.startsWith("19")
				|| lower.contains("equipment") || lower.contains("machinery")
				|| lower.contains("property") || lower.contains("hardware")
				|| lower.contains("vehicle") || lower.contains("building")
				|| lower.contains("furniture") || lower.contains("fixture")
				|| lower.contains("fixed asset")) {
			return "Non-Current Assets";
		}
		return "Current Assets";
	}

	private String resolveLiabilityCategory(String code, String name) {
		String lower = (name != null) ? name.toLowerCase(Locale.ROOT) : "";
		if (code.startsWith("25") || code.startsWith("26") || code.startsWith("27")
				|| lower.contains("loan") || lower.contains("borrowing")
				|| lower.contains("debenture") || lower.contains("mortgage")
				|| lower.contains("long term")) {
			return "Long-Term Liabilities";
		}
		return "Current Liabilities";
	}

	private AccountType resolveFallbackType(String code, String name) {
		if (code.startsWith("1")) return AccountType.ASSET;
		if (code.startsWith("2")) return AccountType.LIABILITY;
		if (code.startsWith("3")) return AccountType.EQUITY;
		if (code.startsWith("4")) return AccountType.REVENUE;
		if (code.startsWith("5")) return AccountType.EXPENSE;
		return AccountType.ASSET;
	}

	private static class AccountAggregator {
		final String code;
		final String name;
		BigDecimal totalDebit = BigDecimal.ZERO;
		BigDecimal totalCredit = BigDecimal.ZERO;

		AccountAggregator(String code, String name) {
			this.code = code;
			this.name = name;
		}

		void add(BigDecimal debit, BigDecimal credit) {
			this.totalDebit = this.totalDebit.add(debit);
			this.totalCredit = this.totalCredit.add(credit);
		}
	}
}
