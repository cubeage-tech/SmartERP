package com.cubeage.erp.settings.dto.notification;
import com.cubeage.erp.settings.enums.NotificationType;
public record NotificationPreferenceResponse(Long id, Long userId, NotificationType type, boolean emailEnabled,
                                             boolean inAppEnabled, boolean smsEnabled) { }
