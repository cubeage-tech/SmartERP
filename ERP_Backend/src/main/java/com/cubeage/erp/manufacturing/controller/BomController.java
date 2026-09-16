package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateBomRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateBomRequest;
import com.cubeage.erp.manufacturing.dto.response.BomDetailsResponse;
import com.cubeage.erp.manufacturing.dto.response.BomResponse;
import com.cubeage.erp.manufacturing.service.BomService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/bom")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class BomController {

    private final BomService bomService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<BomResponse> create(@Valid @RequestBody CreateBomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bomService.create(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping
    public List<BomResponse> getAll() {
        return bomService.getAll(SecurityUtils.currentTenantId());
    }

    @GetMapping("/{id}")
    public BomDetailsResponse getById(@PathVariable Long id) {
        return bomService.getById(SecurityUtils.currentTenantId(), id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','EDIT')")
    public BomResponse update(@PathVariable Long id, @Valid @RequestBody UpdateBomRequest request) {
        return bomService.update(SecurityUtils.currentTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','DELETE')")
    public void delete(@PathVariable Long id) {
        bomService.delete(SecurityUtils.currentTenantId(), id);
    }
}