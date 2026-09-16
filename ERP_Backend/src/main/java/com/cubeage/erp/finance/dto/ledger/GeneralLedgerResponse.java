package com.cubeage.erp.finance.dto.ledger;

import java.math.BigDecimal;
import java.util.List;

public record GeneralLedgerResponse(
		List<GeneralLedgerEntryDto> entries,
		BigDecimal totalDebit,
		BigDecimal totalCredit,
		BigDecimal netBalance,
		int totalRecords
) { }
