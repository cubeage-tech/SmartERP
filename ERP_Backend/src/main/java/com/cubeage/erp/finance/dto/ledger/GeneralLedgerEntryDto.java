package com.cubeage.erp.finance.dto.ledger;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GeneralLedgerEntryDto(
		Long id,
		String entryNumber,
		LocalDate entryDate,
		String description,
		String reference,
		String accountCode,
		String accountName,
		BigDecimal debit,
		BigDecimal credit,
		BigDecimal runningBalance
) { }
