package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="project_task_dependencies",uniqueConstraints=@UniqueConstraint(name="uk_task_dependency",columnNames={"task_id","depends_on_task_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskDependency extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="task_id",nullable=false) private ProjectTask task;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="depends_on_task_id",nullable=false) private ProjectTask dependsOnTask;
}
