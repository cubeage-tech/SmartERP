package com.cubeage.erp.superAdmin.dto.user;

import com.cubeage.erp.superAdmin.enums.PlatformRole;
import jakarta.validation.constraints.*;

public record CreatePlatformUserRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password,
        @NotNull PlatformRole role
) {}
