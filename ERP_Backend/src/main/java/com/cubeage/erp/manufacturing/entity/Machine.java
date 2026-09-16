package com.cubeage.erp.manufacturing.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.manufacturing.enums.MachineStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "machines",
        indexes = {
                @Index(name = "idx_machines_tenant", columnList = "tenant_id"),
                @Index(name = "idx_machines_code_tenant", columnList = "code,tenant_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "code", nullable = false, length = 40)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "shop_floor", nullable = false, length = 150)
    private String shopFloor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MachineStatus status;

    @Column(nullable = false)
    private Integer utilization;

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Column(name = "next_maintenance")
    private LocalDate nextMaintenance;
}