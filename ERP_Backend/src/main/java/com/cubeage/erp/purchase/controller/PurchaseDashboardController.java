package com.cubeage.erp.purchase.controller;

import com.cubeage.erp.purchase.dto.dashboard.PurchaseDashboardResponse;
import com.cubeage.erp.purchase.service.PurchaseDashboardService;
import com.cubeage.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/purchase")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','VIEW')")
public class PurchaseDashboardController {

    private final PurchaseDashboardService dashboardService;

    @GetMapping({"/dashboard", ""})
    public PurchaseDashboardResponse getDashboard() {
        return dashboardService.getDashboard(SecurityUtils.currentTenantId());
    }
}
