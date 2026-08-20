package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.domain.*;
import com.cubeage.erp.tenant.service.TenantDomainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/tenants/{tenantId}/domains") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class TenantDomainController {
    private final TenantDomainService service;
    @PostMapping public ResponseEntity<TenantDomainResponse> add(@PathVariable Long tenantId, @Valid @RequestBody TenantDomainRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.add(tenantId, request)); }
    @GetMapping public List<TenantDomainResponse> list(@PathVariable Long tenantId) { return service.list(tenantId); }
    @PostMapping("/{id}/verify") public TenantDomainResponse verify(@PathVariable Long tenantId, @PathVariable Long id) { return service.verify(tenantId, id); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void remove(@PathVariable Long tenantId, @PathVariable Long id) { service.remove(tenantId, id); }
}
