package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.ApprovalWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApprovalWorkflowRepository extends JpaRepository<ApprovalWorkflow, Long> {
    List<ApprovalWorkflow> findByTenantIdAndCompanyIdOrderByTitle(Long tenantId, Long companyId);
    Optional<ApprovalWorkflow> findByIdAndTenantIdAndCompanyId(Long id, Long tenantId, Long companyId);
    boolean existsByTenantIdAndCompanyIdAndTitleIgnoreCase(Long tenantId, Long companyId, String title);
    boolean existsByTenantIdAndCompanyIdAndTitleIgnoreCaseAndIdNot(Long tenantId, Long companyId, String title, Long id);
    void deleteByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
