package com.cubeage.erp.tenant.mapper;

import com.cubeage.erp.tenant.dto.tenant.*;
import com.cubeage.erp.tenant.entity.Tenant;
import org.springframework.stereotype.Component;

@Component
public class TenantMapper {
    public TenantResponse toResponse(Tenant t) {
        return new TenantResponse(t.getId(), t.getCode(), t.getName(), t.getContactEmail(), t.getContactPhone(),
                t.getStatus(), t.getPlan(), t.getMaxUsers(), t.getCurrency(), t.getTimezone(), t.getTrialEndsAt(),
                t.getCreatedAt(), t.getUpdatedAt());
    }
    public TenantSummaryResponse toSummary(Tenant t, long activeUsers) {
        return new TenantSummaryResponse(t.getId(), t.getCode(), t.getName(), t.getStatus(), t.getPlan(),
                activeUsers, t.getCreatedAt());
    }
}
