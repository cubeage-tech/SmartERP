package com.cubeage.erp.finance.dto.balancesheet;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record BalanceSheetResponse(
		LocalDate asOfDate,
		List<BalanceSheetItemDto> assets,
		BigDecimal totalAssets,
		List<BalanceSheetItemDto> liabilities,
		BigDecimal totalLiabilities,
		List<BalanceSheetItemDto> equity,
		BigDecimal totalEquity,
		BigDecimal currentPeriodNetProfit,
		BigDecimal totalLiabilitiesAndEquity,
		BigDecimal balanceVariance,
		boolean isBalanced
) {}
