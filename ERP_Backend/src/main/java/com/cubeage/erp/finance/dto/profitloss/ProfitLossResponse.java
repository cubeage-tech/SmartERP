package com.cubeage.erp.finance.dto.profitloss;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProfitLossResponse(
		LocalDate startDate,
		LocalDate endDate,
		List<ProfitLossItemDto> revenues,
		BigDecimal totalRevenue,
		List<ProfitLossItemDto> expenses,
		BigDecimal totalExpense,
		BigDecimal grossProfit,
		BigDecimal netProfit
) { }
