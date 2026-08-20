package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.response.ProjectDashboardResponse;
import com.cubeage.erp.projects.service.ProjectDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects/dashboard")
@RequiredArgsConstructor
public class ProjectDashboardController {

    private final ProjectDashboardService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER','EXECUTIVE_OWNER')")
    public ProjectDashboardResponse dashboard(
            @RequestHeader("X-Tenant-Id") Long tenantId) {
        return service.dashboard(tenantId);
    }
}
