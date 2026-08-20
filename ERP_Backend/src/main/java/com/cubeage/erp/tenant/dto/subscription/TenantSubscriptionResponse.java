package com.cubeage.erp.tenant.dto.subscription;

import com.cubeage.erp.tenant.enums.TenantPlan;
import java.math.BigDecimal;
import java.time.Instant;

public record TenantSubscriptionResponse(Long id, Long tenantId, TenantPlan plan, BigDecimal amount,
        String currency, Instant startsAt, Instant endsAt, boolean autoRenew, boolean active, Instant createdAt) { }
