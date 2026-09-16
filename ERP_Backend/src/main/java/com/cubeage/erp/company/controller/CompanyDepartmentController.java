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
@RequestMapping("/api/v1/company/{companyId}/departments")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class CompanyDepartmentController {
    private final CompanyManagementService service;

    @GetMapping public List<DepartmentResponse> list(@PathVariable Long companyId) {
        return service.departments(SecurityUtils.currentTenantId(), companyId);
    }
    @GetMapping("/{id}") public DepartmentResponse get(@PathVariable Long companyId, @PathVariable Long id) {
        return service.department(SecurityUtils.currentTenantId(), companyId, id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','CREATE')")
    public DepartmentResponse create(@PathVariable Long companyId, @Valid @RequestBody DepartmentRequest request) {
        return service.createDepartment(SecurityUtils.currentTenantId(), companyId, request);
    }
    @PutMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public DepartmentResponse update(@PathVariable Long companyId, @PathVariable Long id,
                                     @Valid @RequestBody DepartmentRequest request) {
        return service.updateDepartment(SecurityUtils.currentTenantId(), companyId, id, request);
    }
    @DeleteMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long id) {
        service.deleteDepartment(SecurityUtils.currentTenantId(), companyId, id);
        return ResponseEntity.noContent().build();
    }

}
