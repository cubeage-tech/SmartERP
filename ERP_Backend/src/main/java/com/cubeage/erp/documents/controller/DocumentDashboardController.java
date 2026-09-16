package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.dashboard.DocumentDashboardResponse;
import com.cubeage.erp.documents.service.DocumentDashboardService;
import com.cubeage.erp.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/documents/dashboard")
@RequiredArgsConstructor
public class DocumentDashboardController {

    private final DocumentDashboardService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public DocumentDashboardResponse getDashboard(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getDashboard(principal.getTenantId());
    }
}
