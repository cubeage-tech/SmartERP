package com.cubeage.erp.superAdmin.dto.dashboard;

import java.math.BigDecimal;

public record SuperAdminDashboardResponse(
        long totalTenants,
        long activeTenants,
        long trialTenants,
        long suspendedTenants,
        BigDecimal totalRevenue,
        BigDecimal revenueThisMonth,
        long totalPlatformUsers,
        SystemHealthResponse systemHealth
) {}
