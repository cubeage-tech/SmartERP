package com.cubeage.erp.tenant.dto.user;

import com.cubeage.erp.tenant.enums.TenantUserStatus;
import java.time.Instant;

public record TenantUserResponse(Long id, Long tenantId, Long userId, String name, String email,
                                 TenantUserStatus status, boolean owner, Instant joinedAt) { }
