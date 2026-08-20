package com.cubeage.erp.superAdmin.dto.subscription;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record SubscriptionResponse(
        Long id,
        Long tenantId,
        Long planId,
        String planName,
        SubscriptionStatus status,
        BillingCycle billingCycle,
        BigDecimal amount,
        String currency,
        Instant startsAt,
        Instant endsAt,
        Instant cancelledAt,
        String cancellationReason,
        Boolean autoRenew,
        Instant createdAt
) {}
