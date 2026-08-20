package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record TenantActivatedEvent(Long tenantId, Instant occurredAt) {}
