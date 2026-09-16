package com.cubeage.erp.company.entity;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "company_approval_workflows", uniqueConstraints = {
        @UniqueConstraint(name = "uk_company_workflow_title", columnNames = {"company_id", "title"})
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ApprovalWorkflow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Column(nullable = false, length = 140)
    private String title;
    @Column(name = "trigger_expression", nullable = false, length = 240)
    private String triggerExpression;
    @ElementCollection
    @CollectionTable(name = "company_approval_workflow_steps", joinColumns = @JoinColumn(name = "workflow_id"))
    @OrderColumn(name = "step_order")
    @Column(name = "step_name", nullable = false, length = 100)
    @Builder.Default
    private List<String> steps = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CompanyRecordStatus status = CompanyRecordStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
