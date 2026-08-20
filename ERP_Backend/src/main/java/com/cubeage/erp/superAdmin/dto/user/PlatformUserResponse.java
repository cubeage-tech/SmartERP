package com.cubeage.erp.superAdmin.dto.user;

import com.cubeage.erp.superAdmin.enums.PlatformRole;

import java.time.Instant;

public record PlatformUserResponse(
        Long id,
        String fullName,
        String email,
        PlatformRole role,
        Boolean isActive,
        Instant lastLoginAt,
        Instant createdAt,
        Instant updatedAt
) {}
