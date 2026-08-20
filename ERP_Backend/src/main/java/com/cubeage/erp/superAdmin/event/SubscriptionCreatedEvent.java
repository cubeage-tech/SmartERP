package com.cubeage.erp.superAdmin.event;

import java.time.Instant;

public record SubscriptionCreatedEvent(Long subscriptionId, Long tenantId, Long planId, Instant occurredAt) {}
