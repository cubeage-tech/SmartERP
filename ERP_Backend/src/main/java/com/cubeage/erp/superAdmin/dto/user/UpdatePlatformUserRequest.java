package com.cubeage.erp.superAdmin.dto.user;

import com.cubeage.erp.superAdmin.enums.PlatformRole;
import jakarta.validation.constraints.Email;

public record UpdatePlatformUserRequest(
        String fullName,
        @Email String email,
        PlatformRole role,
        Boolean isActive
) {}
