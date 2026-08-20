package com.cubeage.erp.tenant.entity;

import com.cubeage.erp.tenant.enums.TenantPlan;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "tenant_subscriptions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TenantSubscription {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TenantPlan plan;
    @Column(nullable = false, precision = 19, scale = 2)
    private java.math.BigDecimal amount;
    @Column(nullable = false, length = 10)
    private String currency;
    @Column(nullable = false)
    private Instant startsAt;
    @Column(nullable = false)
    private Instant endsAt;
    @Column(nullable = false)
    private Boolean autoRenew;
    @Column(nullable = false)
    private Boolean active;
    @CreationTimestamp @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
