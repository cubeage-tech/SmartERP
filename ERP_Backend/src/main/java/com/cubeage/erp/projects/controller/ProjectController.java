package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.*;
import com.cubeage.erp.projects.dto.response.*;
import com.cubeage.erp.projects.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public ProjectResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @Valid @RequestBody CreateProjectRequest request) {
        return service.create(tenantId, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public ProjectResponse update(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {
        return service.update(tenantId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public void delete(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        service.delete(tenantId, id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ProjectResponse get(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        return service.get(tenantId, id);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ProjectResponse> all(
            @RequestHeader("X-Tenant-Id") Long tenantId) {
        return service.all(tenantId);
    }

    @PostMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public List<ProjectResponse> search(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestBody ProjectSearchRequest request) {
        return service.search(tenantId, request);
    }

    @GetMapping("/{projectId}/gantt")
    @PreAuthorize("isAuthenticated()")
    public GanttResponse gantt(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.gantt(tenantId, projectId);
    }

    @PostMapping("/{projectId}/members")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public ProjectMemberResponse addMember(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectMemberRequest request) {
        return service.addMember(tenantId, projectId, request);
    }

    @GetMapping("/{projectId}/members")
    @PreAuthorize("isAuthenticated()")
    public List<ProjectMemberResponse> members(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.members(tenantId, projectId);
    }

    @PostMapping("/{projectId}/documents")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public DocumentLinkResponse linkDocument(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId,
            @Valid @RequestBody DocumentLinkRequest request) {
        return service.linkDocument(tenantId, projectId, request);
    }

    @GetMapping("/{projectId}/documents")
    @PreAuthorize("isAuthenticated()")
    public List<DocumentLinkResponse> documents(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.documents(tenantId, projectId);
    }
}
