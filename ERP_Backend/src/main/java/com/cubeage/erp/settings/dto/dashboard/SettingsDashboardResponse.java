package com.cubeage.erp.settings.dto.dashboard;

import com.cubeage.erp.settings.enums.*;

import java.time.Instant;

public record SettingsDashboardResponse(
        Long tenantId,
        String companyName,
        boolean generalSettingsConfigured,
        long enabledModules,
        long connectedIntegrations,
        long activeApprovalWorkflows,
        boolean securitySettingsConfigured,
        SubscriptionPlan subscriptionPlan,
        SubscriptionStatus subscriptionStatus,
        BackupStatus latestBackupStatus,
        Instant latestBackupAt,
        long auditEvents
) { }
