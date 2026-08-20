package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.BackupFrequency;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalTime;

@Entity
@Table(
        name = "backup_settings",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_backup_settings_tenant",
                columnNames = "tenant_id"
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackupSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BackupFrequency frequency;

    @Column(name = "backup_time", nullable = false)
    private LocalTime backupTime;

    @Column(name = "retention_days", nullable = false)
    private Integer retentionDays;

    @Column(nullable = false)
    private Boolean encrypted;

    @Column(name = "include_attachments", nullable = false)
    private Boolean includeAttachments;

    @Column(name = "last_backup_at")
    private Instant lastBackupAt;

    @Column(name = "next_backup_at")
    private Instant nextBackupAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
