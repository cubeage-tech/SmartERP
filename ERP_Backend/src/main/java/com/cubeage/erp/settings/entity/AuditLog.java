package com.cubeage.erp.settings.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity @Table(name="audit_logs", indexes={@Index(name="idx_audit_tenant_created", columnList="tenant_id,created_at")})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(name="actor_user_id") private Long actorUserId;
    @Column(nullable=false) private String action;
    @Column(nullable=false) private String module;
    private String entityType;
    private String entityId;
    @Column(columnDefinition="TEXT") private String details;
    private String ipAddress;
    @CreationTimestamp @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt;
}
