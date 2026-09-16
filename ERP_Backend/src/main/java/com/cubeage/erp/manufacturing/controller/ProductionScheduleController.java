package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateProductionScheduleRequest;
import com.cubeage.erp.manufacturing.dto.response.ProductionScheduleResponse;
import com.cubeage.erp.manufacturing.service.ProductionScheduleService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/schedules")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class ProductionScheduleController {

    private final ProductionScheduleService scheduleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<ProductionScheduleResponse> create(@Valid @RequestBody CreateProductionScheduleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.create(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping
    public List<ProductionScheduleResponse> getAll() {
        return scheduleService.getAll(SecurityUtils.currentTenantId());
    }
}