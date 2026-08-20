package com.cubeage.erp.settings.dto.notification;
import com.cubeage.erp.settings.enums.NotificationType;
import jakarta.validation.constraints.NotNull;
public record NotificationPreferenceRequest(@NotNull NotificationType type, boolean emailEnabled,
                                            boolean inAppEnabled, boolean smsEnabled) { }
