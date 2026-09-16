package com.cubeage.erp.reports.repository;

import com.cubeage.erp.reports.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByTenantId(Long tenantId);
    long countByTenantId(Long tenantId);
}
