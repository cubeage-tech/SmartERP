package com.cubeage.erp.settings.controller;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.integration.*;
import com.cubeage.erp.settings.service.IntegrationSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/settings/integrations") @RequiredArgsConstructor @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class IntegrationSettingsController {
    private final IntegrationSettingsService service;
    @GetMapping public List<IntegrationResponse> list(){return service.list(SecurityUtils.currentTenantId());}
    @PostMapping public ResponseEntity<IntegrationResponse> create(@Valid @RequestBody IntegrationRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(SecurityUtils.currentTenantId(),r));}
    @PutMapping("/{id}") public IntegrationResponse update(@PathVariable Long id,@Valid @RequestBody IntegrationRequest r){return service.update(SecurityUtils.currentTenantId(),id,r);}
    @PostMapping("/{id}/test") public IntegrationStatusResponse test(@PathVariable Long id){return service.test(SecurityUtils.currentTenantId(),id);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(SecurityUtils.currentTenantId(),id);}
}
