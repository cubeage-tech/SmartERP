package com.cubeage.erp.tenant.repository;

import com.cubeage.erp.tenant.entity.Tenant;
import com.cubeage.erp.tenant.enums.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);
    List<Tenant> findByStatusOrderByCreatedAtDesc(TenantStatus status);
    long countByStatus(TenantStatus status);
}
