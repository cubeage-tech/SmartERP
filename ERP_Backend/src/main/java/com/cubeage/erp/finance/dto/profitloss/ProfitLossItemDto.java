package com.cubeage.erp.finance.dto.profitloss;

import java.math.BigDecimal;

public record ProfitLossItemDto(
		String accountCode,
		String accountName,
		String category,
		BigDecimal amount
) { }
