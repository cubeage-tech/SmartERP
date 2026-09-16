package com.cubeage.erp.finance.util;

import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.context.TenantContext;

public final class FinanceTenantResolver {

    private FinanceTenantResolver() { }

    /**
     * Resolves the effective tenant ID for Finance operations.
     * 1. If the authenticated user is SUPER_ADMIN, honor the target headerTenantId or TenantContext.
     * 2. For standard users (TENANT_ADMIN, FINANCE_MANAGER), strictly enforce their own authenticated tenantId to prevent spoofing.
     * 3. Falls back to TenantContext if set.
     * 4. Uses headerTenantId or 1L for unauthenticated or test invocations.
     */
    public static Long resolveTenantId(Long headerTenantId) {
        try {
            if (SecurityUtils.hasRole("SUPER_ADMIN")) {
                if (headerTenantId != null) {
                    return headerTenantId;
                }
                Long contextTenantId = TenantContext.getTenantId();
                if (contextTenantId != null) {
                    return contextTenantId;
                }
            }
            Long authTenantId = SecurityUtils.currentTenantId();
            if (authTenantId != null) {
                return authTenantId;
            }
        } catch (Exception ignored) {
            // Unauthenticated or not a UserPrincipal instance (e.g. unit tests)
        }

        Long contextTenantId = TenantContext.getTenantId();
        if (contextTenantId != null) {
            return contextTenantId;
        }

        if (headerTenantId != null) {
            return headerTenantId;
        }

        return 1L;
    }
}
