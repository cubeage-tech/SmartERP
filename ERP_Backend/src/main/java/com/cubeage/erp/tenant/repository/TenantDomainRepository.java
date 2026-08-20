package com.cubeage.erp.tenant.repository;

import com.cubeage.erp.tenant.entity.TenantDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantDomainRepository extends JpaRepository<TenantDomain, Long> {
    List<TenantDomain> findByTenantIdOrderByPrimaryDomainDesc(Long tenantId);
    Optional<TenantDomain> findByDomainIgnoreCase(String domain);
    Optional<TenantDomain> findByIdAndTenantId(Long id, Long tenantId);
    boolean existsByDomainIgnoreCase(String domain);
}
