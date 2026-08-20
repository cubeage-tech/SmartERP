package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record TenantSuspendedEvent(Long tenantId, String reason, Instant occurredAt) {}
