package com.cubeage.erp.tenant.dto.dashboard;

public record TenantDashboardResponse(long totalTenants, long activeTenants, long trialTenants,
        long suspendedTenants, long activeUsers, long enabledModules) { }
