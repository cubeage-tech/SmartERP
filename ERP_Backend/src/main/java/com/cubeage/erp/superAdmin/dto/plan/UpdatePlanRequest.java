package com.cubeage.erp.superAdmin.dto.plan;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.PlanType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdatePlanRequest(
        String name,
        String description,
        PlanType planType,
        BillingCycle billingCycle,
        @DecimalMin("0.0") BigDecimal price,
        String currency,
        @Min(1) Integer maxUsers,
        @Min(1) Integer maxStorageGb,
        Boolean isActive
) {}
