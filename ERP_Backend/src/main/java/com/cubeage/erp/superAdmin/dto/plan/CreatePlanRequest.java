package com.cubeage.erp.superAdmin.dto.plan;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.PlanType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreatePlanRequest(
        @NotBlank String name,
        String description,
        @NotNull PlanType planType,
        @NotNull BillingCycle billingCycle,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotBlank @Size(max = 10) String currency,
        @NotNull @Min(1) Integer maxUsers,
        @NotNull @Min(1) Integer maxStorageGb,
        Boolean isActive
) {}
