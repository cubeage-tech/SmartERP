package com.cubeage.erp.admin.repository;

import com.cubeage.erp.admin.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    List<Department>
    findByTenantIdOrderByNameAsc(
            Long tenantId
    );

    List<Department>
    findByBranchIdOrderByNameAsc(
            Long branchId
    );

    Optional<Department>
    findByIdAndTenantId(
            Long id,
            Long tenantId
    );

    long countByTenantId(
            Long tenantId
    );
}