package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.CreateMilestoneRequest;
import com.cubeage.erp.projects.dto.response.MilestoneResponse;
import com.cubeage.erp.projects.service.MilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService service;

    @PostMapping("/{projectId}/milestones")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public MilestoneResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateMilestoneRequest request) {
        return service.create(tenantId, projectId, request);
    }

    @GetMapping("/{projectId}/milestones")
    @PreAuthorize("isAuthenticated()")
    public List<MilestoneResponse> list(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.list(tenantId, projectId);
    }

    @PostMapping("/milestones/{milestoneId}/complete")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public MilestoneResponse complete(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long milestoneId) {
        return service.complete(tenantId, milestoneId);
    }
}
