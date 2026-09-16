package com.cubeage.erp.finance.dto.account;

import com.cubeage.erp.finance.enums.AccountType;

public record CreateAccountRequest(
		String code,
		String name,
		AccountType type
) { }
