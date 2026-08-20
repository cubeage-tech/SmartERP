package com.cubeage.erp.settings.dto.security;
import java.time.Instant;
public record AuditLogResponse(Long id, Long actorUserId, String action, String module, String entityType,
                               String entityId, String details, String ipAddress, Instant createdAt) { }
