package com.cubeage.erp.purchase.entity;

import com.cubeage.erp.purchase.enums.GRNStatus;
import com.cubeage.erp.purchase.enums.QualityStatus;
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
        name = "purchase_goods_receipts",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_grn_number",
                columnNames = {"tenant_id", "grn_number"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "grn_number", nullable = false)
    private String grnNumber;

    @Column(nullable = false)
    private Long purchaseOrderId;

    @Column(nullable = false)
    private Long vendorId;

    @Column(nullable = false)
    private String vendorName;

    @Column(nullable = false)
    private LocalDate receivedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GRNStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QualityStatus qualityStatus;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalValue;

    private String notes;

    @OneToMany(mappedBy = "goodsReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    @Builder.Default
    private List<GoodsReceiptItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public void addItem(GoodsReceiptItem item) {
        item.setGoodsReceipt(this);
        items.add(item);
    }
}
