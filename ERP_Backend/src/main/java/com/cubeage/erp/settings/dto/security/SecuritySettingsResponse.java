package com.cubeage.erp.settings.dto.security;
import java.time.Instant;
public record SecuritySettingsResponse(Long id, boolean mfaRequired, int minimumPasswordLength,
        int passwordExpiryDays, int maxLoginAttempts, int sessionTimeoutMinutes,
        boolean ipRestrictionEnabled, Instant updatedAt) { }
