package com.cubeage.erp.settings.controller;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.module.*;
import com.cubeage.erp.settings.service.ModuleSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/settings/modules") @RequiredArgsConstructor
public class ModuleSettingsController {
    private final ModuleSettingsService service;
    @GetMapping public List<ModuleSettingResponse> list(){return service.list(SecurityUtils.currentTenantId());}
    @PutMapping @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')") public ModuleSettingResponse update(@Valid @RequestBody ModuleSettingRequest r){return service.update(SecurityUtils.currentTenantId(),r);}
}
