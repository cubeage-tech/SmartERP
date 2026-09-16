package com.cubeage.erp.finance.dto.balancesheet;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TrialBalanceResponse(
		LocalDate asOfDate,
		List<TrialBalanceItemDto> items,
		BigDecimal grandTotalDebit,
		BigDecimal grandTotalCredit,
		BigDecimal difference,
		boolean isBalanced
) {}
