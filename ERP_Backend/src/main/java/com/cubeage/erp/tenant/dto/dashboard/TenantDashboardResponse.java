package com.cubeage.erp.tenant.dto.dashboard;

import java.math.BigDecimal;
import java.util.Map;

public record TenantDashboardResponse(
        long totalTenants,
        long activeTenants,
        long trialTenants,
        long suspendedTenants,
        long activeUsers,
        long enabledModules,
        long activeSubscriptions,

        /*
         * Amounts are grouped by currency.
         * Never sum INR, USD, etc. into one incorrect total.
         */
        Map<String, BigDecimal> totalSubscriptionRevenueByCurrency,
        Map<String, BigDecimal> currentMonthRevenueByCurrency
) {}