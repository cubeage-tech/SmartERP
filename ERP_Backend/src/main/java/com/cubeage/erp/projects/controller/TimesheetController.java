package com.cubeage.erp.projects.controller;

import com.cubeage.erp.projects.dto.request.CreateTimesheetRequest;
import com.cubeage.erp.projects.dto.response.TimesheetResponse;
import com.cubeage.erp.projects.service.TimesheetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/timesheets")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class TimesheetController {

    private final TimesheetService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TimesheetResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value="X-User-Name", defaultValue="User") String userName,
            @Valid @RequestBody CreateTimesheetRequest request) {
        return service.create(tenantId, userId, userName, request);
    }

    @PostMapping("/{id}/submit")
    public TimesheetResponse submit(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        return service.submit(tenantId, userId, id);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public TimesheetResponse approve(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestHeader("X-User-Id") Long approverId,
            @RequestHeader(value="X-User-Name", defaultValue="Approver") String approverName,
            @PathVariable Long id) {
        return service.approve(tenantId, approverId, approverName, id);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public TimesheetResponse reject(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestHeader("X-User-Id") Long approverId,
            @RequestHeader(value="X-User-Name", defaultValue="Approver") String approverName,
            @PathVariable Long id) {
        return service.reject(tenantId, approverId, approverName, id);
    }

    @GetMapping("/my")
    public List<TimesheetResponse> my(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @RequestHeader("X-User-Id") Long userId) {
        return service.my(tenantId, userId);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','PROJECT_MANAGER')")
    public List<TimesheetResponse> byProject(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long projectId) {
        return service.project(tenantId, projectId);
    }
}
