package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Entity @Table(name="billing_history")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class BillingHistory {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="tenant_id", nullable=false) private Long tenantId;
    @Column(name="subscription_id", nullable=false) private Long subscriptionId;
    @Column(nullable=false, unique=true) private String invoiceNumber;
    @Column(nullable=false, precision=19, scale=2) private BigDecimal amount;
    @Column(nullable=false, length=10) private String currency;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentStatus status;
    private Instant paidAt;
    @CreationTimestamp @Column(nullable=false, updatable=false) private Instant createdAt;
}
