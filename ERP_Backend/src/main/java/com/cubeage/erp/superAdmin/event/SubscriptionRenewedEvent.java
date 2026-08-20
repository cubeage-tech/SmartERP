package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record SubscriptionRenewedEvent(Long subscriptionId, Long tenantId, Instant newEndsAt, Instant occurredAt) {}
