package com.cubeage.erp.superAdmin.dto.setting;

import java.time.Instant;

public record SystemSettingResponse(
        Long id,
        String key,
        String value,
        String description,
        String category,
        Boolean isEncrypted,
        Instant updatedAt,
        Long updatedBy
) {}
