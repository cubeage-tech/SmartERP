package com.cubeage.erp.settings.dto.backup;

import com.cubeage.erp.settings.enums.BackupFrequency;

import java.time.Instant;
import java.time.LocalTime;

public record BackupSettingsResponse(
        Long id,
        BackupFrequency frequency,
        LocalTime backupTime,
        int retentionDays,
        boolean encrypted,
        boolean includeAttachments,
        Instant lastBackupAt,
        Instant nextBackupAt,
        Instant updatedAt
) { }
