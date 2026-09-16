package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.dashboard.FinanceDashboardResponse;
import com.cubeage.erp.finance.service.FinanceDashboardService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cubeage.erp.security.SecurityUtils;

@RestController
@RequestMapping("/api/v1/finance/dashboard")
@RequiredArgsConstructor
public class FinanceDashboardController {

    private final FinanceDashboardService service;

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'FINANCE') "
                    + "or @permissionEvaluator.has(authentication,'FINANCE','VIEW')"
    )
    public FinanceDashboardResponse summary() {
        return service.summary(SecurityUtils.currentTenantId());
    }
}
