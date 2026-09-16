package com.cubeage.erp.finance.dto.journal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record JournalEntryResponse(Long id, String entryNumber, LocalDate entryDate, String description,
								   String reference, String status, BigDecimal totalDebit,
								   BigDecimal totalCredit, List<JournalEntryLineRequest> lines) {
}
