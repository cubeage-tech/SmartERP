package com.cubeage.erp.manufacturing.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "work_orders",
        indexes = {
                @Index(name = "idx_work_orders_tenant", columnList = "tenant_id"),
                @Index(name = "idx_work_orders_tenant_status", columnList = "tenant_id,status"),
                @Index(name = "idx_work_orders_tenant_due_date", columnList = "tenant_id,due_date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "work_order_number", nullable = false, length = 40)
    private String workOrderNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "bom_number", length = 40)
    private String bomNumber;

    @Column(name = "machine_code", length = 40)
    private String machineCode;

    @Column(name = "operator_name", length = 150)
    private String operatorName;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkOrderStatus status;

    @Column(nullable = false)
    private Integer progress;
}