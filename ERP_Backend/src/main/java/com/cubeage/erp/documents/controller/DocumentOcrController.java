package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.dto.ocr.OcrStatsResponse;
import com.cubeage.erp.documents.service.DocumentOcrService;
import com.cubeage.erp.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents/ocr")
@RequiredArgsConstructor
public class DocumentOcrController {

    private final DocumentOcrService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<OcrExtractionResponse> getAll(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getAll(principal.getTenantId());
    }

    @GetMapping("/latest")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public OcrExtractionResponse getLatest(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getLatest(principal.getTenantId());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public OcrStatsResponse getStats(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getStats(principal.getTenantId());
    }

    @PostMapping("/{documentId}/process")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'INVENTORY_MANAGER', 'SALES_MANAGER')")
    public OcrExtractionResponse process(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long documentId
    ) {
        return service.process(principal.getTenantId(), documentId);
    }
}