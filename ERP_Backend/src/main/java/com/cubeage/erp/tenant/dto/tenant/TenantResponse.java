package com.cubeage.erp.tenant.dto.tenant;

import com.cubeage.erp.tenant.enums.*;
import java.time.Instant;

public record TenantResponse(Long id, String code, String name, String contactEmail,
        String contactPhone, TenantStatus status, TenantPlan plan, Integer maxUsers,
        String currency, String timezone, Instant trialEndsAt, Instant createdAt, Instant updatedAt) { }
