package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateMaintenanceRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineMaintenanceResponse;
import com.cubeage.erp.manufacturing.service.MachineMaintenanceService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/maintenances")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class MachineMaintenanceController {

    private final MachineMaintenanceService maintenanceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<MachineMaintenanceResponse> create(@Valid @RequestBody CreateMaintenanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceService.create(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping
    public List<MachineMaintenanceResponse> getAll(@RequestParam(required = false) Long machineId) {
        Long tenantId = SecurityUtils.currentTenantId();
        return machineId != null
                ? maintenanceService.getByMachine(tenantId, machineId)
                : maintenanceService.getAll(tenantId);
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','EDIT')")
    public MachineMaintenanceResponse complete(@PathVariable Long id) {
        return maintenanceService.completeMaintenance(SecurityUtils.currentTenantId(), id);
    }
}