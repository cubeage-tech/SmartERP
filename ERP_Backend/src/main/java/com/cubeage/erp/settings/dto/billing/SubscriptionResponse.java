package com.cubeage.erp.settings.dto.billing;
import com.cubeage.erp.settings.enums.*;
import java.math.BigDecimal;
import java.time.Instant;
public record SubscriptionResponse(Long id, SubscriptionPlan plan, SubscriptionStatus status, BigDecimal amount,
                                   String currency, Instant startsAt, Instant endsAt, boolean autoRenew) { }
