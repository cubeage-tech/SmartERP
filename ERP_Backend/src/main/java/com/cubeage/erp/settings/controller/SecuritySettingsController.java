package com.cubeage.erp.settings.controller;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.security.*;
import com.cubeage.erp.settings.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/settings/security") @RequiredArgsConstructor @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class SecuritySettingsController {
    private final SecuritySettingsService service; private final AuditLogService auditLogService;
    @GetMapping public SecuritySettingsResponse get(){return service.get(SecurityUtils.currentTenantId());}
    @PutMapping public SecuritySettingsResponse update(@Valid @RequestBody SecuritySettingsRequest r){return service.update(SecurityUtils.currentTenantId(),r);}
    @GetMapping("/audit-logs") public Page<AuditLogResponse> logs(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="25") int size){return auditLogService.list(SecurityUtils.currentTenantId(),page,size);}
}
