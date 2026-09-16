package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateMachineRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateMachineRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineResponse;
import com.cubeage.erp.manufacturing.service.MachineService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/machines")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class MachineController {

    private final MachineService machineService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<MachineResponse> create(@Valid @RequestBody CreateMachineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(machineService.create(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping
    public List<MachineResponse> getAll() {
        return machineService.getAll(SecurityUtils.currentTenantId());
    }

    @GetMapping("/{id}")
    public MachineResponse getById(@PathVariable Long id) {
        return machineService.getById(SecurityUtils.currentTenantId(), id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','EDIT')")
    public MachineResponse update(@PathVariable Long id, @Valid @RequestBody UpdateMachineRequest request) {
        return machineService.update(SecurityUtils.currentTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','DELETE')")
    public void delete(@PathVariable Long id) {
        machineService.delete(SecurityUtils.currentTenantId(), id);
    }
}