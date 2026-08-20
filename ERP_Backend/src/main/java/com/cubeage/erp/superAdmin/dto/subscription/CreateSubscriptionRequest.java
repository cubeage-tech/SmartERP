package com.cubeage.erp.superAdmin.dto.subscription;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import jakarta.validation.constraints.*;

import java.time.Instant;

public record CreateSubscriptionRequest(
        @NotNull Long tenantId,
        @NotNull Long planId,
        @NotNull BillingCycle billingCycle,
        @NotNull Instant startsAt,
        @NotNull Instant endsAt,
        @NotNull Boolean autoRenew
) {}
