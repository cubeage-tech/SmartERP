package com.cubeage.erp.tenant.dto.user;

import com.cubeage.erp.tenant.enums.TenantUserStatus;
import jakarta.validation.constraints.NotNull;

public record AssignTenantUserRequest(@NotNull Long userId, TenantUserStatus status, boolean owner) { }
