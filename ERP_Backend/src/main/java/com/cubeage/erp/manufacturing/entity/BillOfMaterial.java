package com.cubeage.erp.manufacturing.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "bill_of_materials",
        indexes = {
                @Index(name = "idx_bom_tenant", columnList = "tenant_id"),
                @Index(name = "idx_bom_number_tenant", columnList = "bom_number,tenant_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillOfMaterial extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "bom_number", nullable = false, length = 40)
    private String bomNumber;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(nullable = false, length = 20)
    private String version;

    @Column(name = "total_cost", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalCost;

    @Column(length = 500)
    private String notes;

    @Lob
    @Column(name = "details_json", columnDefinition = "text")
    private String detailsJson;

    @OneToMany(mappedBy = "billOfMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BomItem> items = new ArrayList<>();

    public void addItem(BomItem item) {
        item.setBillOfMaterial(this);
        items.add(item);
    }
}