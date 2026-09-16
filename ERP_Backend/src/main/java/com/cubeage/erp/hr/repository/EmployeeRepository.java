package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByTenantIdOrderByFirstNameAsc(Long tenantId);

    Optional<Employee> findByIdAndTenantId(Long id, Long tenantId);

    Optional<Employee> findByTenantIdAndUserId(Long tenantId, Long userId);

    Optional<Employee> findByTenantIdAndEmail(Long tenantId, String email);

    boolean existsByTenantIdAndEmployeeCode(
            Long tenantId,
            String employeeCode
    );

    boolean existsByTenantIdAndEmail(
            Long tenantId,
            String email
    );
}