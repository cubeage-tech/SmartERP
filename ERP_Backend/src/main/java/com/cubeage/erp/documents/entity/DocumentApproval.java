package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.documents.enums.ApprovalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_approvals", indexes = {
        @Index(name = "idx_document_approvals_tenant", columnList = "tenant_id"),
        @Index(name = "idx_document_approvals_status", columnList = "tenant_id,status"),
        @Index(name = "idx_document_approvals_approver", columnList = "tenant_id,approver_user_id,status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentApproval extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "submitted_by_user_id")
    private Long submittedByUserId;

    @Column(name = "submitted_by_name")
    private String submittedByName;

    @Column(name = "approver_user_id")
    private Long approverUserId;

    @Column(name = "approver_name")
    private String approverName;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApprovalStatus status;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "acted_at")
    private LocalDateTime actedAt;
}