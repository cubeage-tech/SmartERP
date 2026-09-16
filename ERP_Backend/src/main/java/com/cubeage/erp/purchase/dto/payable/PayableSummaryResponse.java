package com.cubeage.erp.purchase.dto.payable;

import java.math.BigDecimal;

public record PayableSummaryResponse(
        BigDecimal totalPayables,
        BigDecimal overduePayables,
        BigDecimal dueThisWeek,
        long pendingCount,
        String currency
) {}