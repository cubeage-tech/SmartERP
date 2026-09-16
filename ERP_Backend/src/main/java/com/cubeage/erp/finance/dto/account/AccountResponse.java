package com.cubeage.erp.finance.dto.account;

import com.cubeage.erp.finance.enums.AccountType;
import java.time.LocalDateTime;

public record AccountResponse(
		Long id,
		String code,
		String name,
		AccountType type,
		boolean active,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) { }
