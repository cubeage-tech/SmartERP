package com.cubeage.erp.admin.repository;

import com.cubeage.erp.admin.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BranchRepository
        extends JpaRepository<Branch, Long> {

    List<Branch> findByTenantIdOrderByNameAsc(
            Long tenantId
    );

    Optional<Branch> findByIdAndTenantId(
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