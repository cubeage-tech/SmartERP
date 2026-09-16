package com.cubeage.erp.finance.dto.balancesheet;

import java.math.BigDecimal;

public record BalanceSheetItemDto(
		String accountCode,
		String accountName,
		String accountCategory,
		BigDecimal balance
) {}
