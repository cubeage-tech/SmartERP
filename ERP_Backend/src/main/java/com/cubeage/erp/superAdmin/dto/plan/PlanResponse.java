package com.cubeage.erp.superAdmin.dto.plan;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.PlanType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PlanResponse(
        Long id,
        String name,
        String description,
        PlanType planType,
        BillingCycle billingCycle,
        BigDecimal price,
        String currency,
        Integer maxUsers,
        Integer maxStorageGb,
        Boolean isActive,
        List<String> featureKeys,
        Instant createdAt,
        Instant updatedAt
) {}
