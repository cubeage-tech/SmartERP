package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.AiInsightType;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="project_ai_insights") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectAiInsight extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=40) private AiInsightType type;
 @Column(nullable=false) private Integer score;
 @Column(length=3000) private String summary; @Column(length=3000) private String contributingFactors;
 @Column(length=3000) private String recommendation; @Column(nullable=false) private Boolean active;
}
