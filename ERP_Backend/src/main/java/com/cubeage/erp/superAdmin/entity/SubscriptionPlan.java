package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.PlanType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sa_subscription_plans")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SubscriptionPlan {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private PlanType planType;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private BillingCycle billingCycle;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(nullable = false)
    private Integer maxUsers;

    @Column(nullable = false)
    private Integer maxStorageGb;

    private Boolean isActive;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PlanFeature> features = new ArrayList<>();

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
