package com.cubeage.erp.admin.repository;

import com.cubeage.erp.admin.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    List<Role> findByTenantIdOrderByNameAsc(
            Long tenantId
    );

    Optional<Role> findByIdAndTenantId(
            Long id,
            Long tenantId
    );

    boolean existsByTenantIdAndNameIgnoreCase(
            Long tenantId,
            String name
    );

    long countByTenantId(
            Long tenantId
    );
}