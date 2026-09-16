package com.cubeage.erp.finance.dto.cashflow;

import java.math.BigDecimal;
import java.util.List;

public record CashFlowResponse(
		List<MonthlyCashFlowDto> monthlyFlows,
		BigDecimal totalOperating,
		BigDecimal totalInvesting,
		BigDecimal totalFinancing,
		BigDecimal netCashFlow,
		BigDecimal openingCash,
		BigDecimal closingCash
) { }
