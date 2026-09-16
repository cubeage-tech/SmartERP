package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyDepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByTenantIdAndCompanyIdOrderByName(Long tenantId, Long companyId);
    Optional<Department> findByIdAndTenantIdAndCompanyId(Long id, Long tenantId, Long companyId);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCase(Long tenantId, Long companyId, String code);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(Long tenantId, Long companyId, String code, Long id);
    long countByTenantIdAndCompanyId(Long tenantId, Long companyId);
    boolean existsByTenantIdAndCompanyIdAndBranchId(Long tenantId, Long companyId, Long branchId);
    boolean existsByTenantIdAndCompanyIdAndCostCenterId(Long tenantId, Long companyId, Long costCenterId);
    void deleteByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
