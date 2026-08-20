package com.cubeage.erp.tenant.mapper;

import com.cubeage.erp.tenant.dto.subscription.TenantSubscriptionResponse;
import com.cubeage.erp.tenant.entity.TenantSubscription;
import org.springframework.stereotype.Component;

@Component
public class TenantSubscriptionMapper {
    public TenantSubscriptionResponse toResponse(TenantSubscription s) {
        return new TenantSubscriptionResponse(s.getId(), s.getTenantId(), s.getPlan(), s.getAmount(), s.getCurrency(),
                s.getStartsAt(), s.getEndsAt(), Boolean.TRUE.equals(s.getAutoRenew()), Boolean.TRUE.equals(s.getActive()),
                s.getCreatedAt());
    }
}
