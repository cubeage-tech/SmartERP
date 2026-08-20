package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name="subscriptions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Subscription {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private SubscriptionPlan plan;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private SubscriptionStatus status;
    @Column(nullable=false, precision=19, scale=2) private BigDecimal amount;
    @Column(nullable=false, length=10) private String currency;
    @Column(nullable=false) private Instant startsAt;
    @Column(nullable=false) private Instant endsAt;
    @Column(nullable=false) private Boolean autoRenew;
    @CreationTimestamp @Column(nullable=false, updatable=false) private Instant createdAt;
}
