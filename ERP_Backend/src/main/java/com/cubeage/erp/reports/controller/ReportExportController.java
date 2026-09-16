package com.cubeage.erp.reports.controller;

import com.cubeage.erp.reports.dto.export.ReportExportRequest;
import com.cubeage.erp.reports.service.ReportExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportExportController {

    private final ReportExportService service;

    @PostMapping("/{id}/export")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ResponseEntity<byte[]> exportReport(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id,
            @Valid @RequestBody ReportExportRequest request) {
        return service.exportReport(tenantId, id, request);
    }
}
