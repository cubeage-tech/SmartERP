package com.cubeage.erp.settings.controller;

import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.approval.*;
import com.cubeage.erp.settings.service.ApprovalWorkflowSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings/approval-workflows")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class ApprovalWorkflowSettingsController {

    private final ApprovalWorkflowSettingsService service;

    @GetMapping
    public List<ApprovalWorkflowResponse> list() {
        return service.list(SecurityUtils.currentTenantId());
    }

    @PostMapping
    public ResponseEntity<ApprovalWorkflowResponse> create(
            @Valid @RequestBody ApprovalWorkflowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(SecurityUtils.currentTenantId(), request));
    }

    @PutMapping("/{id}")
    public ApprovalWorkflowResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalWorkflowRequest request) {
        return service.update(SecurityUtils.currentTenantId(), id, request);
    }

    @PatchMapping("/{id}/status")
    public ApprovalWorkflowResponse changeStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return service.changeStatus(SecurityUtils.currentTenantId(), id, active);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(SecurityUtils.currentTenantId(), id);
    }
}
