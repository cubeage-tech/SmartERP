package com.cubeage.erp.company.controller;

import com.cubeage.erp.company.dto.CompanyManagementDtos.*;
import com.cubeage.erp.company.service.CompanyManagementService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/company/{companyId}/cost-centers")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class CostCenterController {
    private final CompanyManagementService service;

    @GetMapping public List<CostCenterResponse> list(@PathVariable Long companyId) {
        return service.costCenters(SecurityUtils.currentTenantId(), companyId);
    }
    @GetMapping("/{id}") public CostCenterResponse get(@PathVariable Long companyId, @PathVariable Long id) {
        return service.costCenter(SecurityUtils.currentTenantId(), companyId, id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','CREATE')")
    public CostCenterResponse create(@PathVariable Long companyId, @Valid @RequestBody CostCenterRequest request) {
        return service.createCostCenter(SecurityUtils.currentTenantId(), companyId, request);
    }
    @PutMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public CostCenterResponse update(@PathVariable Long companyId, @PathVariable Long id,
                                     @Valid @RequestBody CostCenterRequest request) {
        return service.updateCostCenter(SecurityUtils.currentTenantId(), companyId, id, request);
    }
    @DeleteMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long id) {
        service.deleteCostCenter(SecurityUtils.currentTenantId(), companyId, id);
        return ResponseEntity.noContent().build();
    }

}
