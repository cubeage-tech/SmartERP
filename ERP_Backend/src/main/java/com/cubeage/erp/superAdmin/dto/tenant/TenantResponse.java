package com.cubeage.erp.superAdmin.dto.tenant;

import com.cubeage.erp.superAdmin.enums.PlanType;
import com.cubeage.erp.superAdmin.enums.TenantStatus;

import java.time.Instant;

public record TenantResponse(
        Long id,
        String code,
        String name,
        String contactEmail,
        String contactPhone,
        TenantStatus status,
        PlanType planType,
        Integer maxUsers,
        String currency,
        String timezone,
        String logoUrl,
        String website,
        String industry,
        String country,
        Instant trialEndsAt,
        Instant createdAt,
        Instant updatedAt
) {}
