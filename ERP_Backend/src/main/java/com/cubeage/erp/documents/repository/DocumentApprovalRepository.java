package com.cubeage.erp.documents.repository;

import com.cubeage.erp.documents.entity.DocumentApproval;
import com.cubeage.erp.documents.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentApprovalRepository extends JpaRepository<DocumentApproval, Long> {

    Optional<DocumentApproval> findByIdAndCompanyId(Long id, Long companyId);

    List<DocumentApproval> findByCompanyIdAndStatusOrderByDueDateAsc(
            Long companyId,
            ApprovalStatus status
    );

    List<DocumentApproval> findByCompanyIdAndApproverUserIdAndStatusOrderByDueDateAsc(
            Long companyId,
            Long approverUserId,
            ApprovalStatus status
    );

    long countByCompanyIdAndStatus(Long companyId, ApprovalStatus status);
}