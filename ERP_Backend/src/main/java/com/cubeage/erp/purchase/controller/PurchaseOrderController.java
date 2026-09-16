package com.cubeage.erp.purchase.controller;

import com.cubeage.erp.purchase.dto.purchaseorder.CreatePurchaseOrderRequest;
import com.cubeage.erp.purchase.dto.purchaseorder.PurchaseOrderResponse;
import com.cubeage.erp.purchase.dto.purchaseorder.UpdatePurchaseOrderRequest;
import com.cubeage.erp.purchase.service.PurchaseOrderService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','VIEW')")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public List<PurchaseOrderResponse> listPurchaseOrders() {
        return purchaseOrderService.listPurchaseOrders(SecurityUtils.currentTenantId());
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse getPurchaseOrder(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrder(SecurityUtils.currentTenantId(), id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','CREATE')")
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(
            @Valid @RequestBody CreatePurchaseOrderRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(purchaseOrderService.createPurchaseOrder(SecurityUtils.currentTenantId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','EDIT')")
    public PurchaseOrderResponse updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePurchaseOrderRequest request
    ) {
        return purchaseOrderService.updatePurchaseOrder(SecurityUtils.currentTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','DELETE')")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(SecurityUtils.currentTenantId(), id);
        return ResponseEntity.noContent().build();
    }
}
