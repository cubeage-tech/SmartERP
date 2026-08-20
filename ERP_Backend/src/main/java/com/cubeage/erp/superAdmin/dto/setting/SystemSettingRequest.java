package com.cubeage.erp.superAdmin.dto.setting;

import jakarta.validation.constraints.NotBlank;

public record SystemSettingRequest(
        @NotBlank String key,
        @NotBlank String value,
        String description,
        String category,
        Boolean isEncrypted
) {}
