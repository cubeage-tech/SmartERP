package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyBranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByTenantIdAndCompanyIdOrderByName(Long tenantId, Long companyId);
    Optional<Branch> findByIdAndTenantIdAndCompanyId(Long id, Long tenantId, Long companyId);
    Optional<Branch> findByTenantIdAndCompanyIdAndNameIgnoreCase(Long tenantId, Long companyId, String name);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCase(Long tenantId, Long companyId, String code);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(Long tenantId, Long companyId, String code, Long id);
    long countByTenantIdAndCompanyId(Long tenantId, Long companyId);
    void deleteByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
