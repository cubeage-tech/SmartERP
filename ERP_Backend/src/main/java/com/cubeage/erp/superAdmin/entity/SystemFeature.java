package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "sa_system_features", uniqueConstraints = @UniqueConstraint(name = "uk_feature_key", columnNames = "feature_key"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SystemFeature {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature_key", nullable = false, unique = true)
    private String featureKey;

    @Column(nullable = false)
    private String featureName;

    private String description;
    private String module;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private FeatureStatus status;

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
