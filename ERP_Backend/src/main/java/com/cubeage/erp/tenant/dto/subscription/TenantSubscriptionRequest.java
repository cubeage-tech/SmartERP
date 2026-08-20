package com.cubeage.erp.tenant.dto.subscription;

import com.cubeage.erp.tenant.enums.TenantPlan;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;

public record TenantSubscriptionRequest(@NotNull TenantPlan plan, @NotNull @PositiveOrZero BigDecimal amount,
        @NotBlank String currency, @NotNull Instant startsAt, @NotNull Instant endsAt, boolean autoRenew) { }
