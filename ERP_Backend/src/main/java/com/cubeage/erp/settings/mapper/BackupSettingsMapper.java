package com.cubeage.erp.settings.mapper;

import com.cubeage.erp.settings.dto.backup.*;
import com.cubeage.erp.settings.entity.*;
import org.springframework.stereotype.Component;

@Component
public class BackupSettingsMapper {

    public BackupSettingsResponse toResponse(BackupSetting setting) {
        return new BackupSettingsResponse(
                setting.getId(),
                setting.getFrequency(),
                setting.getBackupTime(),
                setting.getRetentionDays(),
                Boolean.TRUE.equals(setting.getEncrypted()),
                Boolean.TRUE.equals(setting.getIncludeAttachments()),
                setting.getLastBackupAt(),
                setting.getNextBackupAt(),
                setting.getUpdatedAt()
        );
    }

    public BackupRecordResponse toResponse(BackupRecord record) {
        return new BackupRecordResponse(
                record.getId(),
                record.getRequestedBy(),
                record.getFileName(),
                record.getStatus(),
                record.getStartedAt(),
                record.getCompletedAt(),
                record.getSizeBytes(),
                record.getErrorMessage(),
                record.getCreatedAt()
        );
    }
}
