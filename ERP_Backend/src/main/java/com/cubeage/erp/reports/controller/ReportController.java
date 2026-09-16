package com.cubeage.erp.reports.controller;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.reports.dto.report.ReportRequest;
import com.cubeage.erp.reports.dto.report.ReportResponse;
import com.cubeage.erp.reports.entity.Report;
import com.cubeage.erp.reports.mapper.ReportMapper;
import com.cubeage.erp.reports.repository.ReportRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public List<ReportResponse> getAll(@RequestHeader("X-Tenant-Id") Long tenantId) {
        return reportRepository.findByTenantId(tenantId).stream()
                .map(reportMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportResponse getById(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .filter(r -> r.getTenantId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return reportMapper.toResponse(report);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportResponse create(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @Valid @RequestBody ReportRequest request) {
        Report report = Report.builder()
                .tenantId(tenantId)
                .name(request.name())
                .category(request.category())
                .format(request.format() != null ? request.format() : "PDF / Excel / CSV")
                .schedule(request.schedule() != null ? request.schedule() : com.cubeage.erp.reports.enums.ReportFrequency.NONE)
                .status(request.status() != null ? request.status() : com.cubeage.erp.reports.enums.ReportStatus.ACTIVE)
                .lastRun(LocalDateTime.now())
                .build();
        return reportMapper.toResponse(reportRepository.save(report));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public ReportResponse update(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id,
            @Valid @RequestBody ReportRequest request) {
        Report report = reportRepository.findById(id)
                .filter(r -> r.getTenantId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        if (request.name() != null) report.setName(request.name());
        if (request.category() != null) report.setCategory(request.category());
        if (request.format() != null) report.setFormat(request.format());
        if (request.schedule() != null) report.setSchedule(request.schedule());
        if (request.status() != null) report.setStatus(request.status());

        return reportMapper.toResponse(reportRepository.save(report));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
    public void delete(
            @RequestHeader("X-Tenant-Id") Long tenantId,
            @PathVariable Long id) {
        Report report = reportRepository.findById(id)
                .filter(r -> r.getTenantId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        reportRepository.delete(report);
    }
}
