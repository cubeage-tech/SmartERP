package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.*;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDate;
@Entity @Table(name="project_tasks") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectTask extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="milestone_id") private ProjectMilestone milestone;
 @Column(name="parent_task_id") private Long parentTaskId;
 @Column(nullable=false) private String title; @Column(length=2000) private String description;
 private Long assignedToUserId; private String assignedToName;
 @Column(nullable=false) private LocalDate plannedStartDate; @Column(nullable=false) private LocalDate plannedEndDate;
 private LocalDate actualStartDate; private LocalDate actualEndDate;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private TaskStatus status;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private TaskPriority priority;
 @Column(nullable=false) private Integer progressPercent;
 @Column(nullable=false,precision=10,scale=2) private BigDecimal plannedHours;
 @Column(nullable=false,precision=10,scale=2) private BigDecimal actualHours;
 @Column(nullable=false) private Boolean atRisk; @Column(length=1000) private String riskReason;
}
