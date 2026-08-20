package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.module.*;
import com.cubeage.erp.tenant.service.TenantModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/tenants/{tenantId}/modules") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class TenantModuleController {
    private final TenantModuleService service;
    @PutMapping public TenantModuleResponse configure(@PathVariable Long tenantId, @Valid @RequestBody TenantModuleRequest request) { return service.configure(tenantId, request); }
    @GetMapping public List<TenantModuleResponse> list(@PathVariable Long tenantId) { return service.list(tenantId); }
}
