package com.cubeage.erp.tenant.dto.module;

import com.cubeage.erp.tenant.enums.TenantModuleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record TenantModuleRequest(@NotBlank String moduleKey, @NotNull TenantModuleStatus status,
                                  Instant expiresAt) { }
