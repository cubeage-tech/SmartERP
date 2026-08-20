package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.MilestoneStatus;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDate;
@Entity @Table(name="project_milestones") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectMilestone extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @Column(nullable=false) private String name; @Column(length=1500) private String description;
 @Column(nullable=false) private LocalDate plannedDate; private LocalDate completedDate;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private MilestoneStatus status;
 @Column(nullable=false) private Integer progressPercent;
}
