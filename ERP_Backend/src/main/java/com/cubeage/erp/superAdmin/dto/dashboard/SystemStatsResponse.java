package com.cubeage.erp.superAdmin.dto.dashboard;

public record SystemStatsResponse(
        long totalTenants,
        long activeTenants,
        long totalUsers,
        long activeUsers,
        long totalSubscriptions,
        long activeSubscriptions,
        long totalPlans
) {}
