package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "sa_tenant_features")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TenantFeature {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tenantId;

    @Column(nullable = false)
    private String featureKey;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private FeatureStatus status;

    private Instant expiresAt;

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
