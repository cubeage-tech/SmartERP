package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="project_document_links") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectDocumentLink extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="task_id") private ProjectTask task;
 @Column(name="document_id",nullable=false) private Long documentId; private String documentTitle;
}
