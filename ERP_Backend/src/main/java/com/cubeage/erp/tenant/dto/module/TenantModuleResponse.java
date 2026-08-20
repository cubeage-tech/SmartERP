package com.cubeage.erp.tenant.dto.module;

import com.cubeage.erp.tenant.enums.TenantModuleStatus;
import java.time.Instant;

public record TenantModuleResponse(Long id, Long tenantId, String moduleKey, TenantModuleStatus status,
                                   Instant expiresAt, Instant updatedAt) { }
