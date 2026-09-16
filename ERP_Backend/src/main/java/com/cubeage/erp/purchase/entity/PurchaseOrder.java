package com.cubeage.erp.purchase.entity;

import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "purchase_orders",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_purchase_order_number",
                columnNames = {"tenant_id", "order_number"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "order_number", nullable = false)
    private String orderNumber;

    @Column(nullable = false)
    private Long vendorId;

    @Column(nullable = false)
    private String vendorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseOrderStatus status;

    @Column(nullable = false)
    private LocalDate orderDate;

    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    private String deliveryLocation;

    private String paymentTerms;

    private String notes;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    @Builder.Default
    private List<PurchaseOrderItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public void addItem(PurchaseOrderItem item) {
        item.setPurchaseOrder(this);
        items.add(item);
    }

    public void replaceItems(List<PurchaseOrderItem> newItems) {
        items.clear();
        newItems.forEach(this::addItem);
    }
}
