package com.cubeage.erp.settings.controller;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.billing.*;
import com.cubeage.erp.settings.service.BillingSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/settings/billing") @RequiredArgsConstructor @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class BillingSettingsController {
    private final BillingSettingsService service;
    @GetMapping("/subscription") public SubscriptionResponse current(){return service.current(SecurityUtils.currentTenantId());}
    @PostMapping("/subscription/upgrade") public SubscriptionResponse upgrade(@Valid @RequestBody UpgradePlanRequest r){return service.upgrade(SecurityUtils.currentTenantId(),r);}
    @GetMapping("/history") public List<BillingHistoryResponse> history(){return service.history(SecurityUtils.currentTenantId());}
}
