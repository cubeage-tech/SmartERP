package com.cubeage.erp.reports.service;

import com.cubeage.erp.reports.dto.export.ReportExportRequest;
import org.springframework.http.ResponseEntity;

public interface ReportExportService {
    ResponseEntity<byte[]> exportReport(Long tenantId, Long id, ReportExportRequest request);
}
