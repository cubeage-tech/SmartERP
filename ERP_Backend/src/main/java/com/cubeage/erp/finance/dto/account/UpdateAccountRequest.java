package com.cubeage.erp.finance.dto.account;

public record UpdateAccountRequest(
		String name,
		Boolean active
) { }
