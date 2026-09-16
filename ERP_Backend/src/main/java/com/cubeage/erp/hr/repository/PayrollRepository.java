package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Optional<Payroll> findFirstByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Optional<Payroll> findByTenantIdAndPayrollMonth(Long tenantId, String payrollMonth);
}
