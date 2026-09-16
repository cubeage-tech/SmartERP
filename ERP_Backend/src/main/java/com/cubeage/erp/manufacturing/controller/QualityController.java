package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateQualityInspectionRequest;
import com.cubeage.erp.manufacturing.dto.response.QualityInspectionResponse;
import com.cubeage.erp.manufacturing.dto.response.QualitySummaryResponse;
import com.cubeage.erp.manufacturing.service.QualityService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/quality")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class QualityController {

    private final QualityService qualityService;

    @PostMapping("/inspections")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<QualityInspectionResponse> createInspection(@Valid @RequestBody CreateQualityInspectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(qualityService.createInspection(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping("/inspections")
    public List<QualityInspectionResponse> getInspections() {
        return qualityService.getInspections(SecurityUtils.currentTenantId());
    }

    @GetMapping("/summary")
    public QualitySummaryResponse getSummary() {
        return qualityService.getQualityControlSummary(SecurityUtils.currentTenantId());
    }
}