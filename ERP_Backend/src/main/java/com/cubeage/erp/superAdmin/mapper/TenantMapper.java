package com.cubeage.erp.superAdmin.mapper;

import com.cubeage.erp.superAdmin.dto.tenant.TenantResponse;
import com.cubeage.erp.superAdmin.entity.Tenant;
import org.springframework.stereotype.Component;

@Component("superAdminTenantMapper")
public class TenantMapper {
    public TenantResponse toResponse(Tenant t) {
        return new TenantResponse(t.getId(), t.getCode(), t.getName(), t.getContactEmail(),
                t.getContactPhone(), t.getStatus(), t.getPlanType(), t.getMaxUsers(),
                t.getCurrency(), t.getTimezone(), t.getLogoUrl(), t.getWebsite(),
                t.getIndustry(), t.getCountry(), t.getTrialEndsAt(), t.getCreatedAt(), t.getUpdatedAt());
    }
}
