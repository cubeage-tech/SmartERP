package com.cubeage.erp.finance.dto.cashflow;

import java.math.BigDecimal;

public record MonthlyCashFlowDto(
		String month,
		int year,
		BigDecimal operating,
		BigDecimal investing,
		BigDecimal financing,
		BigDecimal netCashFlow
) { }
