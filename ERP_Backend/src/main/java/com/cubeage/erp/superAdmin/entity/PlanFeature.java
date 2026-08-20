package com.cubeage.erp.superAdmin.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sa_plan_features")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PlanFeature {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Column(nullable = false)
    private String featureKey;

    @Column(nullable = false)
    private String featureName;

    private String featureValue;

    @Column(nullable = false)
    private Boolean included;
}
