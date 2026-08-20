package com.cubeage.erp.superAdmin.dto.tenant;

import com.cubeage.erp.superAdmin.enums.PlanType;
import com.cubeage.erp.superAdmin.enums.TenantStatus;

public record TenantSearchRequest(
        String keyword,
        TenantStatus status,
        PlanType planType,
        String country,
        String industry
) {}
