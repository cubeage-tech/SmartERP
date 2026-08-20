package com.cubeage.erp.sales.entity;

import com.cubeage.erp.sales.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;
@Entity @Table(name="sales_payments",uniqueConstraints=@UniqueConstraint(name="uk_sales_payment_reference",columnNames={"tenant_id","reference"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Payment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @Column(name="invoice_id",nullable=false) private Long invoiceId;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal amount;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private PaymentMethod method;
 @Column(nullable=false) private String reference;
 @Column(nullable=false) private Instant paidAt;
 private String notes;
 @CreationTimestamp @Column(nullable=false,updatable=false) private Instant createdAt;
}
