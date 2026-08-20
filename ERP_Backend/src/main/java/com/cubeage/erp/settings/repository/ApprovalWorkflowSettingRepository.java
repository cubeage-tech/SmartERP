package com.cubeage.erp.settings.repository;

import com.cubeage.erp.settings.entity.ApprovalWorkflowSetting;
import com.cubeage.erp.settings.enums.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApprovalWorkflowSettingRepository
        extends JpaRepository<ApprovalWorkflowSetting, Long> {

    List<ApprovalWorkflowSetting> findByTenantIdOrderByName(Long tenantId);

    Optional<ApprovalWorkflowSetting> findByIdAndTenantId(Long id, Long tenantId);

    boolean existsByTenantIdAndNameIgnoreCase(Long tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(Long tenantId, String name, Long id);

    long countByTenantIdAndStatus(Long tenantId, WorkflowStatus status);
}
