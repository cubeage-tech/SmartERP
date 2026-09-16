package com.cubeage.erp.reports.repository;

import com.cubeage.erp.reports.entity.ReportSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReportScheduleRepository extends JpaRepository<ReportSchedule, Long> {
    Optional<ReportSchedule> findByIdAndTenantId(Long id, Long tenantId);
    List<ReportSchedule> findByTenantId(Long tenantId);

    @Query("SELECT COUNT(rs) > 0 FROM ReportSchedule rs WHERE rs.tenantId = :tenantId AND rs.isCustom = true AND rs.customReport.id = :customReportId AND rs.active = true")
    boolean existsByTenantIdAndIsCustomAndCustomReport_IdAndActiveTrue(@Param("tenantId") Long tenantId, @Param("customReportId") Long customReportId);

    @Query("SELECT COUNT(rs) > 0 FROM ReportSchedule rs WHERE rs.tenantId = :tenantId AND rs.isCustom = false AND rs.report.id = :reportId AND rs.active = true")
    boolean existsByTenantIdAndIsCustomAndReport_IdAndActiveTrue(@Param("tenantId") Long tenantId, @Param("reportId") Long reportId);
}
