package com.cubeage.erp.manufacturing.controller;

import com.cubeage.erp.manufacturing.dto.request.CreateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.response.WorkOrderResponse;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import com.cubeage.erp.manufacturing.service.WorkOrderService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manufacturing/work-orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','VIEW')")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','CREATE')")
    public ResponseEntity<WorkOrderResponse> create(@Valid @RequestBody CreateWorkOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workOrderService.create(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping
    public List<WorkOrderResponse> getAll(@RequestParam(required = false) WorkOrderStatus status) {
        Long tenantId = SecurityUtils.currentTenantId();
        return status != null
                ? workOrderService.getByStatus(tenantId, status)
                : workOrderService.getAll(tenantId);
    }

    @GetMapping("/{id}")
    public WorkOrderResponse getById(@PathVariable Long id) {
        return workOrderService.getById(SecurityUtils.currentTenantId(), id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','EDIT')")
    public WorkOrderResponse update(@PathVariable Long id, @Valid @RequestBody UpdateWorkOrderRequest request) {
        return workOrderService.update(SecurityUtils.currentTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'MANUFACTURING','DELETE')")
    public void delete(@PathVariable Long id) {
        workOrderService.delete(SecurityUtils.currentTenantId(), id);
    }
}