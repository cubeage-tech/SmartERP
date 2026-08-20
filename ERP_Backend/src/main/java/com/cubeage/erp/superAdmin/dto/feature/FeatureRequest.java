package com.cubeage.erp.superAdmin.dto.feature;

import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FeatureRequest(
        @NotBlank String featureKey,
        @NotBlank String featureName,
        String description,
        String module,
        @NotNull FeatureStatus status
) {}
