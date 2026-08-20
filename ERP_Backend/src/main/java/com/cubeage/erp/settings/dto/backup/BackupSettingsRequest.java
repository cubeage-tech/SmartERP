package com.cubeage.erp.settings.dto.backup;

import com.cubeage.erp.settings.enums.BackupFrequency;
import jakarta.validation.constraints.*;

import java.time.LocalTime;

public record BackupSettingsRequest(
        @NotNull BackupFrequency frequency,
        @NotNull LocalTime backupTime,
        @Min(1) @Max(3650) int retentionDays,
        boolean encrypted,
        boolean includeAttachments
) { }
