package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.*;
import com.cubeage.erp.projects.dto.response.TaskResponse;
import com.cubeage.erp.projects.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectTaskController {

    private final TaskService service;

    @PostMapping("/{projectId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public TaskResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request) {
        return service.create(tenantId, projectId, request);
    }

    @GetMapping("/{projectId}/tasks")
    @PreAuthorize("isAuthenticated()")
    public List<TaskResponse> list(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.list(tenantId, projectId);
    }

    @GetMapping("/tasks/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public TaskResponse get(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long taskId) {
        return service.get(tenantId, taskId);
    }

    @PutMapping("/tasks/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public TaskResponse update(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request) {
        return service.update(tenantId, taskId, request);
    }

    @PostMapping("/tasks/{taskId}/dependencies")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public TaskResponse addDependency(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskDependencyRequest request) {
        return service.addDependency(tenantId, taskId, request);
    }

    @PostMapping("/tasks/{taskId}/evaluate-risk")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public void evaluateRisk(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long taskId) {
        service.evaluateDependencyRisk(tenantId, taskId);
    }
}
