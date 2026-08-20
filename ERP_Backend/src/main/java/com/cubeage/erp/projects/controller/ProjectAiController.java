package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.response.AiInsightResponse;
import com.cubeage.erp.projects.service.ProjectAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/ai")
@RequiredArgsConstructor
public class ProjectAiController {

    private final ProjectAiService service;

    @PostMapping("/analyze")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public List<AiInsightResponse> analyze(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.analyze(tenantId, projectId);
    }

    @GetMapping("/insights")
    @PreAuthorize("isAuthenticated()")
    public List<AiInsightResponse> insights(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.insights(tenantId, projectId);
    }
}
