package com.cubeage.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity @Table(name="security_settings", uniqueConstraints=@UniqueConstraint(name="uk_security_setting_tenant", columnNames="tenant_id"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SecuritySetting {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(nullable=false) private Boolean mfaRequired;
    @Column(nullable=false) private Integer minimumPasswordLength;
    @Column(nullable=false) private Integer passwordExpiryDays;
    @Column(nullable=false) private Integer maxLoginAttempts;
    @Column(nullable=false) private Integer sessionTimeoutMinutes;
    @Column(nullable=false) private Boolean ipRestrictionEnabled;
    @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
}
