package com.cubeage.erp.settings.controller;

import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.dashboard.SettingsDashboardResponse;
import com.cubeage.erp.settings.service.SettingsDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SettingsDashboardController {

    private final SettingsDashboardService service;

    @GetMapping
    public SettingsDashboardResponse dashboard() {
        return service.get(SecurityUtils.currentTenantId());
    }

    @GetMapping("/overview")
    public SettingsDashboardResponse overview() {
        return service.get(SecurityUtils.currentTenantId());
    }
}
