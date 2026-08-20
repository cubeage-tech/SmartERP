package com.cubeage.erp.superAdmin.mapper;

import com.cubeage.erp.superAdmin.dto.plan.PlanResponse;
import com.cubeage.erp.superAdmin.entity.SubscriptionPlan;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PlanMapper {
    public PlanResponse toResponse(SubscriptionPlan p) {
        List<String> featureKeys = p.getFeatures().stream()
                .map(f -> f.getFeatureKey()).toList();
        return new PlanResponse(p.getId(), p.getName(), p.getDescription(),
                p.getPlanType(), p.getBillingCycle(), p.getPrice(), p.getCurrency(),
                p.getMaxUsers(), p.getMaxStorageGb(), p.getIsActive(), featureKeys,
                p.getCreatedAt(), p.getUpdatedAt());
    }
}
