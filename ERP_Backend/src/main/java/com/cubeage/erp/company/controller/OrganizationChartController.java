package com.cubeage.erp.company.controller;

import com.cubeage.erp.company.dto.CompanyManagementDtos.OrganizationChartResponse;
import com.cubeage.erp.company.service.CompanyManagementService;
import com.cubeage.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/company/{companyId}/organization-chart")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class OrganizationChartController {
    private final CompanyManagementService service;

    @GetMapping
    public OrganizationChartResponse get(@PathVariable Long companyId) {
        return service.organizationChart(SecurityUtils.currentTenantId(), companyId);
    }

}
