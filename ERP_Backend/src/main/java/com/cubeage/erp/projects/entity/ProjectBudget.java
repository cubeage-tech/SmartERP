package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.BudgetCostType;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal;
@Entity @Table(name="project_budgets",uniqueConstraints=@UniqueConstraint(name="uk_project_budget_type",columnNames={"project_id","cost_type"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectBudget extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @Enumerated(EnumType.STRING) @Column(name="cost_type",nullable=false,length=30) private BudgetCostType costType;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal plannedAmount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal actualAmount;
}
