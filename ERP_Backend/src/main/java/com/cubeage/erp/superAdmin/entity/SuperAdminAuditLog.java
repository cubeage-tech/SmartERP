package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "sa_audit_logs")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SuperAdminAuditLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long performedBy;

    private Long targetTenantId;
    private String targetEntityType;
    private Long targetEntityId;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private AuditAction action;

    @Column(length = 2000)
    private String description;

    @Column(length = 5000)
    private String oldValue;

    @Column(length = 5000)
    private String newValue;

    private String ipAddress;
    private String userAgent;

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
