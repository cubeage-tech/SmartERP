package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="notification_preferences", uniqueConstraints=@UniqueConstraint(name="uk_notification_preference", columnNames={"tenant_id","user_id","type"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationPreference {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(name="user_id", nullable=false) private Long userId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private NotificationType type;
    @Column(nullable=false) private Boolean emailEnabled;
    @Column(nullable=false) private Boolean inAppEnabled;
    @Column(nullable=false) private Boolean smsEnabled;
}
