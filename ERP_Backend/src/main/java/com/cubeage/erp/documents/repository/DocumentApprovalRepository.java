package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.DocumentApproval;
import com.cubeage.erp.documents.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentApprovalRepository extends JpaRepository<DocumentApproval, Long> {

    Optional<DocumentApproval> findByIdAndTenantId(Long id, Long tenantId);

    List<DocumentApproval> findByTenantIdAndStatusOrderByDueDateAsc(
            Long tenantId,
            ApprovalStatus status
    );

    List<DocumentApproval> findByTenantIdAndApproverUserIdAndStatusOrderByDueDateAsc(
            Long tenantId,
            Long approverUserId,
            ApprovalStatus status
    );

    long countByTenantIdAndStatus(Long tenantId, ApprovalStatus status);
}