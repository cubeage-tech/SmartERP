package com.cubeage.erp.finance.dto.dashboard;

import java.math.BigDecimal;

public record FinanceDashboardResponse(long journalEntries, BigDecimal totalDebits,
									   BigDecimal totalCredits, BigDecimal netMovement) {
}
