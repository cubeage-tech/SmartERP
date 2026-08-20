package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.*;
import com.cubeage.erp.projects.dto.response.BudgetSummaryResponse;
import com.cubeage.erp.projects.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/budget")
@RequiredArgsConstructor
public class ProjectBudgetController {

    private final BudgetService service;

    @PutMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public BudgetSummaryResponse setPlanned(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody BudgetRequest request) {
        return service.setPlanned(tenantId, projectId, request);
    }

    @PostMapping("/costs")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public BudgetSummaryResponse addCost(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody CostEntryRequest request) {
        return service.addCost(tenantId, projectId, request);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public BudgetSummaryResponse summary(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.summary(tenantId, projectId);
    }
}
