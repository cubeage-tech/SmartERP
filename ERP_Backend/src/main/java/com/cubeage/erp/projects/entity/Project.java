package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.projects.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity @Table(name="projects", uniqueConstraints=@UniqueConstraint(name="uk_project_tenant_code", columnNames={"tenant_id","project_code"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @Column(name="project_code",nullable=false,length=50) private String projectCode;
 @Column(nullable=false) private String name;
 @Column(length=2000) private String description;
 private Long customerId; private String customerName;
 @Column(name="manager_user_id",nullable=false) private Long managerUserId;
 private String managerName; private Long branchId; private Long departmentId; private Long costCenterId;
 @Column(nullable=false) private LocalDate startDate; @Column(nullable=false) private LocalDate endDate;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private ProjectStatus status;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private ProjectPriority priority;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal plannedBudget;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal actualBudget;
 @Column(nullable=false,precision=5,scale=2) private BigDecimal budgetAlertThresholdPercent;
 @Column(nullable=false) private Integer progressPercent;
}
