package com.cubeage.erp.finance.dto.balancesheet;

import com.cubeage.erp.finance.enums.AccountType;
import java.math.BigDecimal;

public record TrialBalanceItemDto(
		String accountCode,
		String accountName,
		AccountType accountType,
		BigDecimal totalDebit,
		BigDecimal totalCredit,
		BigDecimal netDebit,
		BigDecimal netCredit
) {}
