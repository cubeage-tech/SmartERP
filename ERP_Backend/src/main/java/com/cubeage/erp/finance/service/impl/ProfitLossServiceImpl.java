package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.profitloss.ProfitLossItemDto;
import com.cubeage.erp.finance.dto.profitloss.ProfitLossResponse;
import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.repository.JournalEntryLineRepository;
import com.cubeage.erp.finance.service.AccountService;
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
public class ProfitLossServiceImpl implements ProfitLossService {

	private final JournalEntryLineRepository lineRepository;
	private final AccountRepository accountRepository;
	private final AccountService accountService;

	@Override
	public ProfitLossResponse getProfitLoss(Long tenantId, LocalDate startDate, LocalDate endDate) {
		accountService.initDefaultAccountsIfEmpty(tenantId);

		List<JournalEntryLine> lines = lineRepository.findFilteredPostedLines(
				tenantId, JournalStatus.POSTED, null, startDate, endDate
		);

		// Include all accounts (active and historical inactive) so explicit database type is always authoritative
		Map<String, Account> accountMap = accountRepository.findByTenantIdOrderByIdAsc(tenantId).stream()
				.collect(Collectors.toMap(Account::getCode, a -> a, (a, b) -> a));

		Map<String, ProfitLossAccumulator> revenueMap = new LinkedHashMap<>();
		Map<String, ProfitLossAccumulator> expenseMap = new LinkedHashMap<>();

		for (JournalEntryLine line : lines) {
			String code = line.getAccountCode();
			String name = line.getAccountName();
			BigDecimal debit = line.getDebit() != null ? line.getDebit() : BigDecimal.ZERO;
			BigDecimal credit = line.getCredit() != null ? line.getCredit() : BigDecimal.ZERO;

			AccountType type = resolveAccountType(code, name, accountMap);

			if (type == AccountType.REVENUE) {
				BigDecimal netCredit = credit.subtract(debit);
				revenueMap.computeIfAbsent(code, k -> new ProfitLossAccumulator(code, name, "Revenue"))
						.add(netCredit);
			} else if (type == AccountType.EXPENSE) {
				BigDecimal netDebit = debit.subtract(credit);
				expenseMap.computeIfAbsent(code, k -> new ProfitLossAccumulator(code, name, "Expense"))
						.add(netDebit);
			}
		}

		List<ProfitLossItemDto> revenues = revenueMap.values().stream()
				.map(a -> new ProfitLossItemDto(a.code, a.name, a.category, a.amount))
				.toList();

		List<ProfitLossItemDto> expenses = expenseMap.values().stream()
				.map(a -> new ProfitLossItemDto(a.code, a.name, a.category, a.amount))
				.toList();

		BigDecimal totalRevenue = revenues.stream()
				.map(ProfitLossItemDto::amount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal totalExpense = expenses.stream()
				.map(ProfitLossItemDto::amount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal netProfit = totalRevenue.subtract(totalExpense);
		BigDecimal grossProfit = totalRevenue;

		return new ProfitLossResponse(
				startDate,
				endDate,
				revenues,
				totalRevenue,
				expenses,
				totalExpense,
				grossProfit,
				netProfit
		);
	}

	private AccountType resolveAccountType(String code, String name, Map<String, Account> accountMap) {
		// 1. Authoritative check: registered account in Chart of Accounts
		Account account = accountMap.get(code);
		if (account != null && account.getType() != null) {
			return account.getType();
		}

		// 2. Secondary fallback for unseeded legacy accounts
		String lowerName = (name != null) ? name.toLowerCase(Locale.ROOT) : "";
		String trimmedCode = (code != null) ? code.trim() : "";

		if (trimmedCode.startsWith("4") || lowerName.contains("revenue") || lowerName.contains("sales") || lowerName.contains("income")) {
			return AccountType.REVENUE;
		}
		if (trimmedCode.startsWith("5") || trimmedCode.startsWith("6") || trimmedCode.startsWith("7")
				|| lowerName.contains("expense") || lowerName.contains("salary") || lowerName.contains("rent")
				|| lowerName.contains("cost") || lowerName.contains("depreciation") || lowerName.contains("tax")) {
			return AccountType.EXPENSE;
		}

		return AccountType.ASSET;
	}

	private static class ProfitLossAccumulator {
		final String code;
		final String name;
		final String category;
		BigDecimal amount = BigDecimal.ZERO;

		ProfitLossAccumulator(String code, String name, String category) {
			this.code = code;
			this.name = name;
			this.category = category;
		}

		void add(BigDecimal value) {
			this.amount = this.amount.add(value);
		}
	}
}
