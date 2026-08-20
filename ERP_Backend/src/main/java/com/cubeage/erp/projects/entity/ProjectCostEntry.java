package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.BudgetCostType;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDate;
@Entity @Table(name="project_cost_entries") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectCostEntry extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="task_id") private ProjectTask task;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private BudgetCostType costType;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal amount; @Column(nullable=false) private LocalDate costDate;
 @Column(length=1000) private String description; private String referenceType; private Long referenceId;
}
