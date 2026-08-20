package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.dashboard.TenantDashboardResponse;
import com.cubeage.erp.tenant.service.TenantDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/tenants/dashboard") @RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class TenantDashboardController {
    private final TenantDashboardService service;
    @GetMapping public TenantDashboardResponse get() { return service.platform(); }
}
