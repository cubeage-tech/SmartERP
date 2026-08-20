package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.*;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="project_risks") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectRisk extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="task_id") private ProjectTask task;
 @Column(nullable=false) private String title; @Column(length=2000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private RiskType type;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private RiskLevel level;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private RiskStatus status;
 @Column(nullable=false) private Integer probabilityPercent; @Column(nullable=false) private Integer impactScore;
 @Column(length=2000) private String mitigationPlan; private Long ownerUserId; private String ownerName;
 @Column(nullable=false) private Boolean aiGenerated;
}
