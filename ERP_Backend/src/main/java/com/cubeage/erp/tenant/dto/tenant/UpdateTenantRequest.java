package com.cubeage.erp.tenant.dto.tenant;

import com.cubeage.erp.tenant.enums.TenantPlan;
import com.cubeage.erp.tenant.enums.TenantStatus;
import jakarta.validation.constraints.*;

public record UpdateTenantRequest(
        @Size(min = 2, max = 160) String name,
        @Email String contactEmail,
        @Size(max = 30) String contactPhone,
        TenantStatus status,
        TenantPlan plan,
        @Min(1) @Max(100000) Integer maxUsers,
        @Size(max = 10) String currency,
        @Size(max = 60) String timezone) { }
