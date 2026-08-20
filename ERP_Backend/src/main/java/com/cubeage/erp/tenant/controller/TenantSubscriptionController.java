package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.subscription.*;
import com.cubeage.erp.tenant.service.TenantSubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/tenants/{tenantId}/subscriptions") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class TenantSubscriptionController {
    private final TenantSubscriptionService service;
    @PostMapping public ResponseEntity<TenantSubscriptionResponse> subscribe(@PathVariable Long tenantId, @Valid @RequestBody TenantSubscriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.subscribe(tenantId, request)); }
    @GetMapping("/current") public TenantSubscriptionResponse current(@PathVariable Long tenantId) { return service.current(tenantId); }
    @GetMapping public List<TenantSubscriptionResponse> history(@PathVariable Long tenantId) { return service.history(tenantId); }
}
