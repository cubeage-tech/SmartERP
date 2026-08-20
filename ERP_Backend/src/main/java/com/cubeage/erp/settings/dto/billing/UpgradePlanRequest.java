package com.cubeage.erp.settings.dto.billing;
import com.cubeage.erp.settings.enums.SubscriptionPlan;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record UpgradePlanRequest(@NotNull SubscriptionPlan plan, @NotNull @PositiveOrZero BigDecimal amount,
                                 @NotBlank String currency, boolean autoRenew) { }
