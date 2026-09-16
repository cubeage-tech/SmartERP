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
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class CompanyController {
    private final CompanyManagementService service;

    @GetMapping
    public List<CompanyResponse> list() { return service.companies(SecurityUtils.currentTenantId()); }

    @GetMapping("/{id}")
    public CompanyResponse get(@PathVariable Long id) { return service.company(SecurityUtils.currentTenantId(), id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','CREATE')")
    public CompanyResponse create(@Valid @RequestBody CompanyRequest request) {
        return service.createCompany(SecurityUtils.currentTenantId(), request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public CompanyResponse update(@PathVariable Long id, @Valid @RequestBody CompanyRequest request) {
        return service.updateCompany(SecurityUtils.currentTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCompany(SecurityUtils.currentTenantId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/dashboard")
    public CompanyDashboardResponse dashboard(@PathVariable Long id) {
        return service.dashboard(SecurityUtils.currentTenantId(), id);
    }

    @GetMapping("/{id}/settings")
    public CompanySettingsResponse settings(@PathVariable Long id) {
        return service.settings(SecurityUtils.currentTenantId(), id);
    }

    @PutMapping("/{id}/settings")
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public CompanySettingsResponse updateSettings(@PathVariable Long id,
                                                   @RequestBody CompanySettingsRequest request) {
        return service.updateSettings(SecurityUtils.currentTenantId(), id, request);
    }

}
