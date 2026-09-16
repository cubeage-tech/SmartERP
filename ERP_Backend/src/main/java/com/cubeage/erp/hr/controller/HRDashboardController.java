package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.dashboard.HRDashboardResponse;
import com.cubeage.erp.hr.service.HRDashboardService;
import com.cubeage.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hr/dashboard")
@RequiredArgsConstructor
@PreAuthorize(
        "hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_MANAGER', 'HR') " +
                "or @permissionEvaluator.has(authentication, 'HR', 'VIEW')"
)
public class HRDashboardController {

    private final HRDashboardService dashboardService;

    @GetMapping
    public HRDashboardResponse getDashboard() {
        return dashboardService.getDashboardSummary(SecurityUtils.currentTenantId());
    }

    @GetMapping("/summary")
    public HRDashboardResponse getSummary() {
        return dashboardService.getDashboardSummary(SecurityUtils.currentTenantId());
    }
}