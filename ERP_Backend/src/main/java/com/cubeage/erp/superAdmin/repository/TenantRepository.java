package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.Tenant;
import com.cubeage.erp.superAdmin.enums.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long>, JpaSpecificationExecutor<Tenant> {
    Optional<Tenant> findByCode(String code);
    boolean existsByCode(String code);
    boolean existsByContactEmail(String email);
    List<Tenant> findByStatus(TenantStatus status);
    long countByStatus(TenantStatus status);
}
