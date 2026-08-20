package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.TimesheetStatus;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDate;
@Entity @Table(name="project_timesheets") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Timesheet extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="task_id",nullable=false) private ProjectTask task;
 @Column(name="user_id",nullable=false) private Long userId; private String userName;
 @Column(nullable=false) private LocalDate workDate; @Column(nullable=false,precision=8,scale=2) private BigDecimal hours;
 @Column(length=1000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private TimesheetStatus status;
 private Long approvedByUserId; private String approvedByName;
}
