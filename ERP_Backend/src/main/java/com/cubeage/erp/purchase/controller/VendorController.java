package com.cubeage.erp.purchase.controller;

import com.cubeage.erp.purchase.dto.vendor.VendorRequest;
import com.cubeage.erp.purchase.dto.vendor.VendorResponse;
import com.cubeage.erp.purchase.dto.vendor.VendorSummaryResponse;
import com.cubeage.erp.purchase.service.VendorService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchase/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','VIEW')")
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public List<VendorSummaryResponse> listVendors() {
        return vendorService.listVendors(SecurityUtils.currentTenantId());
    }

    @GetMapping("/{id}")
    public VendorResponse getVendor(@PathVariable Long id) {
        return vendorService.getVendor(SecurityUtils.currentTenantId(), id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','CREATE')")
    public ResponseEntity<VendorResponse> createVendor(
            @Valid @RequestBody VendorRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vendorService.createVendor(
                        SecurityUtils.currentTenantId(),
                        request
                ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','EDIT')")
    public VendorResponse updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request
    ) {
        return vendorService.updateVendor(
                SecurityUtils.currentTenantId(),
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'OPERATIONS', 'FINANCE_MANAGER', 'FINANCE', 'SALES_MANAGER', 'SALES', 'HR_MANAGER', 'HR') or @permissionEvaluator.has(authentication,'PURCHASE','DELETE')")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(SecurityUtils.currentTenantId(), id);
        return ResponseEntity.noContent().build();
    }
}