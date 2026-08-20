package com.cubeage.erp.tenant.dto.tenant;

import com.cubeage.erp.tenant.enums.TenantPlan;
import jakarta.validation.constraints.*;

public record CreateTenantRequest(
        @NotBlank @Pattern(regexp = "[A-Za-z0-9_-]{2,50}") String code,
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Email String contactEmail,
        @Size(max = 30) String contactPhone,
        @NotNull TenantPlan plan,
        @Min(1) @Max(100000) Integer maxUsers,
        @Size(max = 10) String currency,
        @Size(max = 60) String timezone) { }
