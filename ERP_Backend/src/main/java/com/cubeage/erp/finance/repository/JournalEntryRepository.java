package com.cubeage.erp.finance.repository;

import com.cubeage.erp.finance.entity.JournalEntry;
import com.cubeage.erp.finance.enums.JournalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
	Optional<JournalEntry> findByIdAndTenantId(Long id, Long tenantId);
	List<JournalEntry> findByTenantIdOrderByEntryDateDescIdDesc(Long tenantId);
	List<JournalEntry> findByTenantIdAndStatusOrderByEntryDateDescIdDesc(Long tenantId, JournalStatus status);
	List<JournalEntry> findByTenantIdAndStatusOrderByEntryDateAscIdAsc(Long tenantId, JournalStatus status);
	List<JournalEntry> findByTenantIdAndEntryDateBetweenOrderByEntryDateDescIdDesc(Long tenantId, LocalDate startDate, LocalDate endDate);
	List<JournalEntry> findByTenantIdAndStatusAndEntryDateBetweenOrderByEntryDateDescIdDesc(Long tenantId, JournalStatus status, LocalDate startDate, LocalDate endDate);
	long countByTenantId(Long tenantId);
}
