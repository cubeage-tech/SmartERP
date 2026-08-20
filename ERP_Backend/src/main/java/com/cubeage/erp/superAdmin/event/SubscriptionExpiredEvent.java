package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record SubscriptionExpiredEvent(Long subscriptionId, Long tenantId, Instant occurredAt) {}
