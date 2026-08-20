package com.cubeage.erp.tenant.controller;

import com.cubeage.erp.tenant.dto.user.*;
import com.cubeage.erp.tenant.service.TenantUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/tenants/{tenantId}/users") @RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class TenantUserController {
    private final TenantUserService service;
    @PutMapping public TenantUserResponse assign(@PathVariable Long tenantId, @Valid @RequestBody AssignTenantUserRequest request) { return service.assign(tenantId, request); }
    @GetMapping public List<TenantUserResponse> list(@PathVariable Long tenantId) { return service.list(tenantId); }
    @DeleteMapping("/{userId}") @ResponseStatus(HttpStatus.NO_CONTENT) public void remove(@PathVariable Long tenantId, @PathVariable Long userId) { service.remove(tenantId, userId); }
}
