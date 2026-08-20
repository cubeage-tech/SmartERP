package com.cubeage.erp.superAdmin.dto.tenant;

import com.cubeage.erp.superAdmin.enums.PlanType;
import jakarta.validation.constraints.*;

public record CreateTenantRequest(
        @NotBlank @Size(max = 50) String code,
        @NotBlank String name,
        @NotBlank @Email String contactEmail,
        String contactPhone,
        @NotNull PlanType planType,
        @NotNull @Min(1) Integer maxUsers,
        @NotBlank @Size(max = 10) String currency,
        @NotBlank @Size(max = 60) String timezone,
        String logoUrl,
        String website,
        String industry,
        String country
) {}
