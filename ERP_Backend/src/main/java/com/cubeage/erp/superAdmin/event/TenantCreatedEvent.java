package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record TenantCreatedEvent(Long tenantId, String tenantCode, String contactEmail, Instant occurredAt) {}
