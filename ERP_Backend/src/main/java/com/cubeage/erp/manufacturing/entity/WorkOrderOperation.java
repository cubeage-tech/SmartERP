package com.cubeage.erp.manufacturing.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "work_order_operations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderOperation extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(nullable = false, length = 150)
    private String operationName;

    @Column(name = "machine_code", length = 40)
    private String machineCode;

    @Column(name = "standard_hours")
    private Double standardHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkOrderStatus status;
}