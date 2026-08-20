package com.cubeage.erp.sales.entity;

import com.cubeage.erp.sales.enums.SalesOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
@Entity @Table(name="sales_orders",uniqueConstraints=@UniqueConstraint(name="uk_sales_order_number",columnNames={"tenant_id","order_number"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SalesOrder {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @Column(name="order_number",nullable=false) private String orderNumber;
 private Long quotationId;
 @Column(nullable=false) private Long customerId;
 @Column(nullable=false) private String customerName;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private SalesOrderStatus status;
 @Column(nullable=false) private LocalDate orderDate;
 private LocalDate expectedDeliveryDate;
 private LocalDate actualDeliveryDate;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal subtotal;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal taxAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal totalAmount;
 @OneToMany(mappedBy="salesOrder",cascade=CascadeType.ALL,orphanRemoval=true) @OrderBy("id") @Builder.Default private List<SalesOrderItem> items=new ArrayList<>();
 @CreationTimestamp @Column(nullable=false,updatable=false) private Instant createdAt;
 @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
 public void addItem(SalesOrderItem item){item.setSalesOrder(this);items.add(item);}
}
