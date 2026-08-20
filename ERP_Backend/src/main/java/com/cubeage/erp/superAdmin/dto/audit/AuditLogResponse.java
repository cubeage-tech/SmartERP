package com.cubeage.erp.superAdmin.dto.audit;

import com.cubeage.erp.superAdmin.enums.AuditAction;

import java.time.Instant;

public record AuditLogResponse(
        Long id,
        Long performedBy,
        Long targetTenantId,
        String targetEntityType,
        Long targetEntityId,
        AuditAction action,
        String description,
        String oldValue,
        String newValue,
        String ipAddress,
        String userAgent,
        Instant createdAt
) {}
