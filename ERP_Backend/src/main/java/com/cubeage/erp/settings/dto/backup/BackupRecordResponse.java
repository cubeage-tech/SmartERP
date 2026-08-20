package com.cubeage.erp.settings.dto.backup;

import com.cubeage.erp.settings.enums.BackupStatus;

import java.time.Instant;

public record BackupRecordResponse(
        Long id,
        Long requestedBy,
        String fileName,
        BackupStatus status,
        Instant startedAt,
        Instant completedAt,
        Long sizeBytes,
        String errorMessage,
        Instant createdAt
) { }
