package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;
import com.cubeage.erp.documents.service.DocumentApprovalService;
import com.cubeage.erp.security.user.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents/approvals")
@RequiredArgsConstructor
public class DocumentApprovalController {

    private final DocumentApprovalService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public DocumentApprovalResponse create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody DocumentApprovalRequest request
    ) {
        return service.create(principal.getTenantId(), principal.getId(), principal.getUsername(), request);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentApprovalResponse> getPending(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getPending(principal.getTenantId());
    }

    @GetMapping("/my-pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentApprovalResponse> getMyPending(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getMyPending(principal.getTenantId(), principal.getId());
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER', 'SALES_MANAGER')")
    public DocumentApprovalResponse approve(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        return service.approve(principal.getTenantId(), id, comment(body));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER', 'SALES_MANAGER')")
    public DocumentApprovalResponse reject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        return service.reject(principal.getTenantId(), id, comment(body));
    }

    private String comment(Map<String, String> body) {
        return body == null ? null : body.get("comment");
    }
}