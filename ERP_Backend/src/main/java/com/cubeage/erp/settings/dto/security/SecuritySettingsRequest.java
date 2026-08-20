package com.cubeage.erp.settings.dto.security;
import jakarta.validation.constraints.*;
public record SecuritySettingsRequest(boolean mfaRequired, @Min(8) @Max(128) int minimumPasswordLength,
        @Min(0) @Max(365) int passwordExpiryDays, @Min(1) @Max(20) int maxLoginAttempts,
        @Min(5) @Max(1440) int sessionTimeoutMinutes, boolean ipRestrictionEnabled) { }
