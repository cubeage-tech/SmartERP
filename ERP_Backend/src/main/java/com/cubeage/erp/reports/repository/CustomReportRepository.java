package com.cubeage.erp.reports.repository;

import com.cubeage.erp.reports.entity.CustomReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;

public interface CustomReportRepository extends JpaRepository<CustomReport, Long>, JpaSpecificationExecutor<CustomReport> {
    Optional<CustomReport> findByIdAndTenantId(Long id, Long tenantId);
    List<CustomReport> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    boolean existsByTenantIdAndNameIgnoreCase(Long tenantId, String name);
}
