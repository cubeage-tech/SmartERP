package com.cubeage.erp.reports.controller;

import com.cubeage.erp.reports.dto.dashboard.ReportDashboardResponse;
import com.cubeage.erp.reports.service.ReportDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportDashboardController {

    private final ReportDashboardService service;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportDashboardResponse getDashboardData(
            @RequestHeader("X-Tenant-Id") Long tenantId) {
        return service.getDashboardData(tenantId);
    }
}
