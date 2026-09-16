package com.cubeage.erp.reports.controller;

import com.cubeage.erp.reports.dto.custom.CustomReportRequest;
import com.cubeage.erp.reports.dto.custom.CustomReportResponse;
import com.cubeage.erp.reports.dto.custom.PreviewDataResponse;
import com.cubeage.erp.reports.service.CustomReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports/custom")
@RequiredArgsConstructor
public class CustomReportController {

    private final CustomReportService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public CustomReportResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @Valid @RequestBody CustomReportRequest request) {
        return service.create(tenantId, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public CustomReportResponse update(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id,
            @Valid @RequestBody CustomReportRequest request) {
        return service.update(tenantId, id, request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public CustomReportResponse get(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        return service.get(tenantId, id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public List<CustomReportResponse> all(
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

    @PostMapping("/{id}/preview")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public PreviewDataResponse getPreview(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        return service.getPreview(tenantId, id);
    }

    @PostMapping("/preview-dynamic")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public PreviewDataResponse getPreviewDynamic(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @Valid @RequestBody CustomReportRequest request) {
        return service.getPreviewDynamic(tenantId, request);
    }
}
