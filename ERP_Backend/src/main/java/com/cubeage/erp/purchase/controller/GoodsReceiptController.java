package com.cubeage.erp.purchase.controller;

import com.cubeage.erp.purchase.dto.grn.CreateGoodsReceiptRequest;
import com.cubeage.erp.purchase.dto.grn.GoodsReceiptResponse;
import com.cubeage.erp.purchase.service.GoodsReceiptService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase/grn")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','VIEW')")
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;

    @GetMapping
    public List<GoodsReceiptResponse> listGoodsReceipts() {
        return goodsReceiptService.listGoodsReceipts(SecurityUtils.currentTenantId());
    }

    @GetMapping("/{id}")
    public GoodsReceiptResponse getGoodsReceipt(@PathVariable Long id) {
        return goodsReceiptService.getGoodsReceipt(SecurityUtils.currentTenantId(), id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','CREATE')")
    public ResponseEntity<GoodsReceiptResponse> createGoodsReceipt(
            @Valid @RequestBody CreateGoodsReceiptRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goodsReceiptService.createGoodsReceipt(SecurityUtils.currentTenantId(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','DELETE')")
    public ResponseEntity<Void> deleteGoodsReceipt(@PathVariable Long id) {
        goodsReceiptService.deleteGoodsReceipt(SecurityUtils.currentTenantId(), id);
        return ResponseEntity.noContent().build();
    }
}
