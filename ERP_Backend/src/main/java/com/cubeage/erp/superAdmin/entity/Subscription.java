package com.cubeage.erp.superAdmin.entity;

import com.cubeage.erp.superAdmin.enums.BillingCycle;
import com.cubeage.erp.superAdmin.enums.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity(name = "SuperAdminSubscription")
@Table(name = "sa_subscriptions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Subscription {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private SubscriptionPlan plan;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private SubscriptionStatus status;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private BillingCycle billingCycle;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(nullable = false)
    private Instant startsAt;

    @Column(nullable = false)
    private Instant endsAt;

    private Instant cancelledAt;
    private String cancellationReason;

    @Column(nullable = false)
    private Boolean autoRenew;

    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(nullable = false)
    private Instant updatedAt;
}
