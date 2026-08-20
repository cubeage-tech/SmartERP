package com.cubeage.erp.sales.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="sales_invoice_items") @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceItem {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="invoice_id",nullable=false) private Invoice invoice;
 private Long productId;
 @Column(nullable=false) private String description;
 @Column(nullable=false,precision=19,scale=3) private BigDecimal quantity;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal unitPrice;
 @Column(nullable=false,precision=7,scale=3) private BigDecimal taxRate;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal lineTotal;
}
