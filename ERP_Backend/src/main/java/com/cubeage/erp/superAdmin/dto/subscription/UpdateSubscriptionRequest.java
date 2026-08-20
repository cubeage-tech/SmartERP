package com.cubeage.erp.superAdmin.dto.subscription;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.SubscriptionStatus;

import java.time.Instant;

public record UpdateSubscriptionRequest(
        Long planId,
        BillingCycle billingCycle,
        SubscriptionStatus status,
        Instant endsAt,
        Boolean autoRenew,
        String cancellationReason
) {}
