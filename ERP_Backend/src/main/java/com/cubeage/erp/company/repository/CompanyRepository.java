package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByTenantIdOrderByName(Long tenantId);
    Optional<Company> findByIdAndTenantId(Long id, Long tenantId);
    boolean existsByTenantIdAndCodeIgnoreCase(Long tenantId, String code);
    boolean existsByTenantIdAndCodeIgnoreCaseAndIdNot(Long tenantId, String code, Long id);
}
