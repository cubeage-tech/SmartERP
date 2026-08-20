package com.cubeage.erp.settings.service;

import com.cubeage.erp.settings.dto.backup.BackupRecordResponse;
import com.cubeage.erp.settings.entity.*;
import com.cubeage.erp.settings.enums.*;
import com.cubeage.erp.settings.mapper.BackupSettingsMapper;
import com.cubeage.erp.settings.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BackupSettingsServiceTest {

    private BackupSettingRepository settingsRepository;
    private BackupRecordRepository recordRepository;
    private BackupSettingsService service;

    @BeforeEach
    void setUp() {
        settingsRepository = mock(BackupSettingRepository.class);
        recordRepository = mock(BackupRecordRepository.class);
        when(settingsRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(recordRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        service = new BackupSettingsService(
                settingsRepository,
                recordRepository,
                new BackupSettingsMapper()
        );
    }

    @Test
    void manualBackupIsQueuedForTheAuthenticatedUser() {
        BackupSetting setting = BackupSetting.builder()
                .tenantId(4L)
                .frequency(BackupFrequency.DAILY)
                .backupTime(LocalTime.of(2, 0))
                .retentionDays(30)
                .encrypted(true)
                .includeAttachments(true)
                .build();
        when(settingsRepository.findByTenantId(4L)).thenReturn(Optional.of(setting));

        BackupRecordResponse response = service.requestBackup(4L, 21L);

        assertEquals(21L, response.requestedBy());
        assertEquals(BackupStatus.QUEUED, response.status());
        verify(recordRepository).save(any(BackupRecord.class));
    }
}
