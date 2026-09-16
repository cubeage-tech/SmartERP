package com.cubeage.erp.manufacturing.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.manufacturing.enums.QualityInspectionType;
import com.cubeage.erp.manufacturing.enums.QualityResult;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quality_inspections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityInspection extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "work_order_number", nullable = false, length = 40)
    private String workOrderNumber;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QualityInspectionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private QualityResult result;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 255)
    private String reason;

    @Column(name = "inspector_name", length = 150)
    private String inspectorName;
}