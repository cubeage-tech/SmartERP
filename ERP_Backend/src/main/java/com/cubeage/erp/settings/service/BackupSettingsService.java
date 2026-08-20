package com.cubeage.erp.settings.service;

import com.cubeage.erp.settings.dto.backup.*;
import com.cubeage.erp.settings.entity.*;
import com.cubeage.erp.settings.enums.*;
import com.cubeage.erp.settings.mapper.BackupSettingsMapper;
import com.cubeage.erp.settings.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BackupSettingsService {

    private final BackupSettingRepository settingsRepository;
    private final BackupRecordRepository recordRepository;
    private final BackupSettingsMapper mapper;

    public BackupSettingsResponse get(Long tenantId) {
        BackupSetting setting = settingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> settingsRepository.save(defaults(tenantId)));
        return mapper.toResponse(setting);
    }

    public BackupSettingsResponse update(Long tenantId, BackupSettingsRequest request) {
        BackupSetting setting = settingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> defaults(tenantId));
        setting.setFrequency(request.frequency());
        setting.setBackupTime(request.backupTime());
        setting.setRetentionDays(request.retentionDays());
        setting.setEncrypted(request.encrypted());
        setting.setIncludeAttachments(request.includeAttachments());
        setting.setNextBackupAt(calculateNextRun(request.frequency(), request.backupTime()));
        return mapper.toResponse(settingsRepository.save(setting));
    }

    public BackupRecordResponse requestBackup(Long tenantId, Long requestedBy) {
        BackupSetting setting = settingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> settingsRepository.save(defaults(tenantId)));
        BackupRecord record = BackupRecord.builder()
                .tenantId(tenantId)
                .requestedBy(requestedBy)
                .status(BackupStatus.QUEUED)
                .build();
        setting.setNextBackupAt(calculateNextRun(setting.getFrequency(), setting.getBackupTime()));
        settingsRepository.save(setting);
        return mapper.toResponse(recordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<BackupRecordResponse> history(Long tenantId) {
        return recordRepository.findTop50ByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    private BackupSetting defaults(Long tenantId) {
        LocalTime backupTime = LocalTime.of(2, 0);
        return BackupSetting.builder()
                .tenantId(tenantId)
                .frequency(BackupFrequency.DAILY)
                .backupTime(backupTime)
                .retentionDays(30)
                .encrypted(true)
                .includeAttachments(true)
                .nextBackupAt(calculateNextRun(BackupFrequency.DAILY, backupTime))
                .build();
    }

    private Instant calculateNextRun(BackupFrequency frequency, LocalTime time) {
        if (frequency == BackupFrequency.MANUAL) {
            return null;
        }
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime candidate = now.toLocalDate().atTime(time).atZone(ZoneOffset.UTC);
        if (!candidate.isAfter(now)) {
            candidate = switch (frequency) {
                case DAILY -> candidate.plusDays(1);
                case WEEKLY -> candidate.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
                case MONTHLY -> candidate.with(TemporalAdjusters.firstDayOfNextMonth());
                case MANUAL -> candidate;
            };
        }
        return candidate.toInstant();
    }
}
