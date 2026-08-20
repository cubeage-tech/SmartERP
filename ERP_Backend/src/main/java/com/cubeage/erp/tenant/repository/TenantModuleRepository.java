package com.cubeage.erp.tenant.repository;

import com.cubeage.erp.tenant.entity.TenantModule;
import com.cubeage.erp.tenant.enums.TenantModuleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantModuleRepository extends JpaRepository<TenantModule, Long> {
    List<TenantModule> findByTenantIdOrderByModuleKey(Long tenantId);
    Optional<TenantModule> findByTenantIdAndModuleKeyIgnoreCase(Long tenantId, String moduleKey);
    long countByTenantIdAndStatus(Long tenantId, TenantModuleStatus status);
}
