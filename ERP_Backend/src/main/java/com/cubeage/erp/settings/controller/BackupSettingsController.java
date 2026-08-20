package com.cubeage.erp.settings.controller;

import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.settings.dto.backup.*;
import com.cubeage.erp.settings.service.BackupSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings/backups")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')")
public class BackupSettingsController {

    private final BackupSettingsService service;

    @GetMapping("/configuration")
    public BackupSettingsResponse get() {
        return service.get(SecurityUtils.currentTenantId());
    }

    @PutMapping("/configuration")
    public BackupSettingsResponse update(@Valid @RequestBody BackupSettingsRequest request) {
        return service.update(SecurityUtils.currentTenantId(), request);
    }

    @PostMapping
    public ResponseEntity<BackupRecordResponse> requestBackup() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                service.requestBackup(
                        SecurityUtils.currentTenantId(),
                        SecurityUtils.currentUserId()
                )
        );
    }

    @GetMapping
    public List<BackupRecordResponse> history() {
        return service.history(SecurityUtils.currentTenantId());
    }
}
