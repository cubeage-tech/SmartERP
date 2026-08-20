package com.cubeage.erp.tenant.entity;

import com.cubeage.erp.tenant.enums.TenantUserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "tenant_users", uniqueConstraints = @UniqueConstraint(name = "uk_tenant_user", columnNames = {"tenant_id", "user_id"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TenantUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TenantUserStatus status;
    @Column(nullable = false)
    private Boolean owner;
    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant joinedAt;
}
