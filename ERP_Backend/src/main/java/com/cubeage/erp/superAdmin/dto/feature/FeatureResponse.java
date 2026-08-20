package com.cubeage.erp.superAdmin.dto.feature;

import com.cubeage.erp.superAdmin.enums.FeatureStatus;

import java.time.Instant;

public record FeatureResponse(
        Long id,
        String featureKey,
        String featureName,
        String description,
        String module,
        FeatureStatus status,
        Instant createdAt,
        Instant updatedAt
) {}
