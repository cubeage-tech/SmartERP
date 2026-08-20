package com.cubeage.erp.superAdmin.dto.tenant;

import com.cubeage.erp.superAdmin.enums.PlanType;
import com.cubeage.erp.superAdmin.enums.TenantStatus;
import jakarta.validation.constraints.*;

public record UpdateTenantRequest(
        String name,
        @Email String contactEmail,
        String contactPhone,
        TenantStatus status,
        PlanType planType,
        @Min(1) Integer maxUsers,
        String currency,
        String timezone,
        String logoUrl,
        String website,
        String industry,
        String country
) {}
