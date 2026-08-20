package com.cubeage.erp.superAdmin.dto.feature;

import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record TenantFeatureRequest(
        @NotNull Long tenantId,
        @NotBlank String featureKey,
        @NotNull FeatureStatus status,
        Instant expiresAt
) {}
