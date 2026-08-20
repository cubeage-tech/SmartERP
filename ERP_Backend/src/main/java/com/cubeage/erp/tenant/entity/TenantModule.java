package com.cubeage.erp.tenant.entity;

import com.cubeage.erp.tenant.enums.TenantModuleStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@Entity
@Table(name = "tenant_modules", uniqueConstraints = @UniqueConstraint(name = "uk_tenant_module", columnNames = {"tenant_id", "module_key"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TenantModule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @Column(name = "module_key", nullable = false)
    private String moduleKey;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TenantModuleStatus status;
    private Instant expiresAt;
    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
