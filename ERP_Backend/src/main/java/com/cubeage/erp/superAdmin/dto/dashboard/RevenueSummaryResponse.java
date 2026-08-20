package com.cubeage.erp.superAdmin.dto.dashboard;

import java.math.BigDecimal;

public record RevenueSummaryResponse(
        BigDecimal totalRevenue,
        BigDecimal monthlyRevenue,
        BigDecimal yearlyRevenue,
        long activeSubscriptions,
        long expiredSubscriptions
) {}
