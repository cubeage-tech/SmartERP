package com.cubeage.erp.projects.entity;
import com.cubeage.erp.common.base.BaseEntity; import com.cubeage.erp.projects.enums.ProjectMemberRole;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDate;
@Entity @Table(name="project_members",uniqueConstraints=@UniqueConstraint(name="uk_project_member",columnNames={"project_id","user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectMember extends BaseEntity {
 @Column(name="tenant_id",nullable=false) private Long tenantId;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="project_id",nullable=false) private Project project;
 @Column(name="user_id",nullable=false) private Long userId; private String userName;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private ProjectMemberRole role;
 @Column(nullable=false,precision=5,scale=2) private BigDecimal allocationPercent;
 private LocalDate fromDate; private LocalDate toDate; @Column(nullable=false) private Boolean active;
}
