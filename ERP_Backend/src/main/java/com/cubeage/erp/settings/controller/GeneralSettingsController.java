package com.cubeage.erp.settings.controller;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.general.*;
import com.cubeage.erp.settings.service.GeneralSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/settings/general") @RequiredArgsConstructor
public class GeneralSettingsController {
    private final GeneralSettingsService service;
    @GetMapping @PreAuthorize("isAuthenticated()") public GeneralSettingsResponse get(){return service.get(SecurityUtils.currentTenantId());}
    @PutMapping @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')") public GeneralSettingsResponse update(@Valid @RequestBody GeneralSettingsRequest r){return service.update(SecurityUtils.currentTenantId(),r);}
}
