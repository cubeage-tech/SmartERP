package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.CostCenter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CostCenterRepository extends JpaRepository<CostCenter, Long> {
    List<CostCenter> findByTenantIdAndCompanyIdOrderByCode(Long tenantId, Long companyId);
    Optional<CostCenter> findByIdAndTenantIdAndCompanyId(Long id, Long tenantId, Long companyId);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCase(Long tenantId, Long companyId, String code);
    boolean existsByTenantIdAndCompanyIdAndCodeIgnoreCaseAndIdNot(Long tenantId, Long companyId, String code, Long id);
    void deleteByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
