package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.CompanySettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanySettingsRepository extends JpaRepository<CompanySettings, Long> {
    Optional<CompanySettings> findByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
