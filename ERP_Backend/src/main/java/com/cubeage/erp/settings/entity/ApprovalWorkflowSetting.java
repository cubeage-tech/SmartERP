package com.cubeage.erp.settings.entity;

import com.cubeage.erp.settings.enums.ApprovalMode;
import com.cubeage.erp.settings.enums.ModuleType;
import com.cubeage.erp.settings.enums.WorkflowStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(
        name = "approval_workflow_settings",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_approval_workflow_tenant_name",
                columnNames = {"tenant_id", "name"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalWorkflowSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ModuleType module;

    @Column(name = "trigger_action", nullable = false, length = 80)
    private String triggerAction;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_mode", nullable = false, length = 30)
    private ApprovalMode approvalMode;

    @Column(name = "minimum_approvers", nullable = false)
    private Integer minimumApprovers;

    @Column(name = "approver_role_ids", nullable = false, columnDefinition = "TEXT")
    private String approverRoleIds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkflowStatus status;

    @Column(name = "configuration_json", columnDefinition = "TEXT")
    private String configurationJson;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
