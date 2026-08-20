package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.RiskRequest;
import com.cubeage.erp.projects.dto.response.RiskResponse;
import com.cubeage.erp.projects.service.RiskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectRiskController {

    private final RiskService service;

    @PostMapping("/{projectId}/risks")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public RiskResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody RiskRequest request) {
        return service.create(tenantId, projectId, request);
    }

    @GetMapping("/{projectId}/risks")
    @PreAuthorize("isAuthenticated()")
    public List<RiskResponse> list(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.list(tenantId, projectId);
    }

    @PostMapping("/risks/{riskId}/resolve")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public RiskResponse resolve(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long riskId) {
        return service.resolve(tenantId, riskId);
    }
}
