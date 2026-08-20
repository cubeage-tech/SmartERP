package com.cubeage.erp.superAdmin.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "sa_system_settings", uniqueConstraints = @UniqueConstraint(name = "uk_setting_key", columnNames = "setting_key"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SystemSetting {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "setting_key", nullable = false, unique = true)
    private String key;

    @Column(nullable = false, length = 2000)
    private String value;

    private String description;
    private String category;

    @Column(nullable = false)
    private Boolean isEncrypted;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;

    private Long updatedBy;
}
