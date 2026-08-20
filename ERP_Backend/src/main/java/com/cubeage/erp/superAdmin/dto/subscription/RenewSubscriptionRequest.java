package com.cubeage.erp.superAdmin.dto.subscription;

import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record RenewSubscriptionRequest(
        @NotNull Instant newEndsAt,
        Boolean autoRenew
) {}
