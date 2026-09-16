package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.response.ManufacturingDashboardResponse;
import com.cubeage.erp.manufacturing.service.ManufacturingDashboardService;
import com.cubeage.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manufacturing/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class ManufacturingDashboardController {

    private final ManufacturingDashboardService dashboardService;

    @GetMapping
    public ManufacturingDashboardResponse getDashboard() {
        return dashboardService.getDashboard(SecurityUtils.currentTenantId());
    }
}