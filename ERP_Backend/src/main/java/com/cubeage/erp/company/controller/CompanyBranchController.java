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
@RequestMapping("/api/v1/company/{companyId}/branches")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class CompanyBranchController {
    private final CompanyManagementService service;

    @GetMapping public List<BranchResponse> list(@PathVariable Long companyId) {
        return service.branches(SecurityUtils.currentTenantId(), companyId);
    }
    @GetMapping("/{id}") public BranchResponse get(@PathVariable Long companyId, @PathVariable Long id) {
        return service.branch(SecurityUtils.currentTenantId(), companyId, id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','CREATE')")
    public BranchResponse create(@PathVariable Long companyId, @Valid @RequestBody BranchRequest request) {
        return service.createBranch(SecurityUtils.currentTenantId(), companyId, request);
    }
    @PutMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public BranchResponse update(@PathVariable Long companyId, @PathVariable Long id,
                                 @Valid @RequestBody BranchRequest request) {
        return service.updateBranch(SecurityUtils.currentTenantId(), companyId, id, request);
    }
    @DeleteMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long id) {
        service.deleteBranch(SecurityUtils.currentTenantId(), companyId, id);
        return ResponseEntity.noContent().build();
    }

}
