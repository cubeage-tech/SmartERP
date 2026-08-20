package com.cubeage.erp.sales.entity;

import com.cubeage.erp.sales.enums.QuotationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
@Entity @Table(name="quotations",uniqueConstraints=@UniqueConstraint(name="uk_quotation_number",columnNames={"tenant_id","quotation_number"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Quotation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @Column(name="quotation_number",nullable=false) private String quotationNumber;
 @Column(name="customer_id",nullable=false) private Long customerId;
 @Column(nullable=false) private String customerName;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private QuotationStatus status;
 @Column(nullable=false) private LocalDate quotationDate;
 @Column(nullable=false) private LocalDate validUntil;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal subtotal;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal taxAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal totalAmount;
 @Column(columnDefinition="TEXT") private String notes;
 @OneToMany(mappedBy="quotation",cascade=CascadeType.ALL,orphanRemoval=true) @OrderBy("id") @Builder.Default private List<QuotationItem> items=new ArrayList<>();
 @CreationTimestamp @Column(nullable=false,updatable=false) private Instant createdAt;
 @UpdateTimestamp @Column(nullable=false) private Instant updatedAt;
 public void replaceItems(List<QuotationItem> newItems){items.clear();newItems.forEach(i->{i.setQuotation(this);items.add(i);});}
}
