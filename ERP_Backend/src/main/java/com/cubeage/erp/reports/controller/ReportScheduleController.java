package com.cubeage.erp.reports.controller;

import com.cubeage.erp.reports.dto.schedule.ReportScheduleRequest;
import com.cubeage.erp.reports.dto.schedule.ReportScheduleResponse;
import com.cubeage.erp.reports.service.ReportScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports/schedules")
@RequiredArgsConstructor
public class ReportScheduleController {

    private final ReportScheduleService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportScheduleResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @Valid @RequestBody ReportScheduleRequest request) {
        return service.create(tenantId, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportScheduleResponse update(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id,
            @Valid @RequestBody ReportScheduleRequest request) {
        return service.update(tenantId, id, request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportScheduleResponse get(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        return service.get(tenantId, id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public List<ReportScheduleResponse> all(
            @RequestHeader("X-Tenant-Id") Long tenantId) {
        return service.all(tenantId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public void delete(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        service.delete(tenantId, id);
    }
}
