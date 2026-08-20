package com.cubeage.erp.sales.entity;

import com.cubeage.erp.sales.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
@Entity @Table(name="sales_invoices",uniqueConstraints=@UniqueConstraint(name="uk_sales_invoice_number",columnNames={"tenant_id","invoice_number"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Invoice {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @Column(name="invoice_number",nullable=false) private String invoiceNumber;
 @Column(name="sales_order_id",nullable=false) private Long salesOrderId;
 @Column(nullable=false) private Long customerId;
 @Column(nullable=false) private String customerName;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private InvoiceStatus status;
 @Column(nullable=false) private LocalDate issueDate;
 @Column(nullable=false) private LocalDate dueDate;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal subtotal;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal taxAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal totalAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal paidAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal balanceDue;
 @OneToMany(mappedBy="invoice",cascade=CascadeType.ALL,orphanRemoval=true) @OrderBy("id") @Builder.Default private List<InvoiceItem> items=new ArrayList<>();
 @CreationTimestamp @Column(nullable=false,updatable=false) private Instant createdAt;
 @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
 public void addItem(InvoiceItem item){item.setInvoice(this);items.add(item);}
}
