package com.cubeage.erp.superAdmin.mapper;

import com.cubeage.erp.superAdmin.dto.subscription.SubscriptionResponse;
import com.cubeage.erp.superAdmin.entity.Subscription;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {
    public SubscriptionResponse toResponse(Subscription s) {
        return new SubscriptionResponse(s.getId(), s.getTenantId(),
                s.getPlan().getId(), s.getPlan().getName(), s.getStatus(),
                s.getBillingCycle(), s.getAmount(), s.getCurrency(),
                s.getStartsAt(), s.getEndsAt(), s.getCancelledAt(),
                s.getCancellationReason(), s.getAutoRenew(), s.getCreatedAt());
    }
}
