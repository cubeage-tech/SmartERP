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
@RequestMapping("/api/v1/company/{companyId}/approval-workflows")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','VIEW')")
public class ApprovalWorkflowController {
    private final CompanyManagementService service;

    @GetMapping public List<ApprovalWorkflowResponse> list(@PathVariable Long companyId) {
        return service.workflows(SecurityUtils.currentTenantId(), companyId);
    }
    @GetMapping("/{id}") public ApprovalWorkflowResponse get(@PathVariable Long companyId, @PathVariable Long id) {
        return service.workflow(SecurityUtils.currentTenantId(), companyId, id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','CREATE')")
    public ApprovalWorkflowResponse create(@PathVariable Long companyId,
                                           @Valid @RequestBody ApprovalWorkflowRequest request) {
        return service.createWorkflow(SecurityUtils.currentTenantId(), companyId, request);
    }
    @PutMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','EDIT')")
    public ApprovalWorkflowResponse update(@PathVariable Long companyId, @PathVariable Long id,
                                           @Valid @RequestBody ApprovalWorkflowRequest request) {
        return service.updateWorkflow(SecurityUtils.currentTenantId(), companyId, id, request);
    }
    @DeleteMapping("/{id}") @PreAuthorize("@permissionEvaluator.has(authentication,'COMPANY_MANAGEMENT','DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Long companyId, @PathVariable Long id) {
        service.deleteWorkflow(SecurityUtils.currentTenantId(), companyId, id);
        return ResponseEntity.noContent().build();
    }
}
