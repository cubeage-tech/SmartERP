package com.cubeage.erp.company.repository;

import com.cubeage.erp.company.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByTenantIdAndCompanyIdAndDateBetweenOrderByDate(
            Long tenantId, Long companyId, LocalDate from, LocalDate to);
    Optional<Holiday> findByIdAndTenantIdAndCompanyId(Long id, Long tenantId, Long companyId);
    boolean existsByTenantIdAndCompanyIdAndNameIgnoreCaseAndDate(Long tenantId, Long companyId, String name, LocalDate date);
    boolean existsByTenantIdAndCompanyIdAndNameIgnoreCaseAndDateAndIdNot(Long tenantId, Long companyId, String name, LocalDate date, Long id);
    void deleteByTenantIdAndCompanyId(Long tenantId, Long companyId);
}
