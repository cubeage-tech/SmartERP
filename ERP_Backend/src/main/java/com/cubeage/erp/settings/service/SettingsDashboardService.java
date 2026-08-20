package com.cubeage.erp.settings.service;

import com.cubeage.erp.settings.dto.dashboard.SettingsDashboardResponse;
import com.cubeage.erp.settings.entity.*;
import com.cubeage.erp.settings.enums.*;
import com.cubeage.erp.settings.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SettingsDashboardService {

    private final GeneralSettingsRepository generalSettingsRepository;
    private final ModuleSettingRepository moduleSettingRepository;
    private final IntegrationSettingRepository integrationSettingRepository;
    private final ApprovalWorkflowSettingRepository approvalWorkflowRepository;
    private final SecuritySettingRepository securitySettingRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BackupRecordRepository backupRecordRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public SettingsDashboardResponse get(Long tenantId) {
        Optional<GeneralSettings> general = generalSettingsRepository.findByTenantId(tenantId);
        Optional<Subscription> subscription = subscriptionRepository
                .findFirstByTenantIdAndStatusInOrderByCreatedAtDesc(
                        tenantId,
                        List.of(
                                SubscriptionStatus.ACTIVE,
                                SubscriptionStatus.TRIAL,
                                SubscriptionStatus.PAST_DUE
                        )
                );
        Optional<BackupRecord> backup = backupRecordRepository
                .findFirstByTenantIdOrderByCreatedAtDesc(tenantId);

        return new SettingsDashboardResponse(
                tenantId,
                general.map(GeneralSettings::getCompanyName).orElse(null),
                general.isPresent(),
                moduleSettingRepository.countByTenantIdAndEnabledTrue(tenantId),
                integrationSettingRepository.countByTenantIdAndStatus(
                        tenantId,
                        IntegrationStatus.CONNECTED
                ),
                approvalWorkflowRepository.countByTenantIdAndStatus(
                        tenantId,
                        WorkflowStatus.ACTIVE
                ),
                securitySettingRepository.findByTenantId(tenantId).isPresent(),
                subscription.map(Subscription::getPlan).orElse(null),
                subscription.map(Subscription::getStatus).orElse(null),
                backup.map(BackupRecord::getStatus).orElse(null),
                backup.map(record -> record.getCompletedAt() != null
                        ? record.getCompletedAt()
                        : record.getCreatedAt()).orElse(null),
                auditLogRepository.countByTenantId(tenantId)
        );
    }
}
