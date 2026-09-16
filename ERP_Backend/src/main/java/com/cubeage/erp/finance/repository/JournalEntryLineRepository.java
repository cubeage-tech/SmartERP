package com.cubeage.erp.finance.repository;

import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.JournalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface JournalEntryLineRepository extends JpaRepository<JournalEntryLine, Long> {

	@Query("SELECT l FROM JournalEntryLine l JOIN l.journalEntry j " +
	       "WHERE j.tenantId = :tenantId AND j.status = :status " +
	       "ORDER BY j.entryDate ASC, j.id ASC, l.id ASC")
	List<JournalEntryLine> findPostedLines(@Param("tenantId") Long tenantId,
	                                       @Param("status") JournalStatus status);

	@Query("SELECT l FROM JournalEntryLine l JOIN l.journalEntry j " +
	       "WHERE j.tenantId = :tenantId AND j.status = :status " +
	       "AND j.entryDate >= :startDate " +
	       "AND j.entryDate <= :endDate " +
	       "ORDER BY j.entryDate ASC, j.id ASC, l.id ASC")
	List<JournalEntryLine> findLinesBetweenDates(@Param("tenantId") Long tenantId,
	                                             @Param("status") JournalStatus status,
	                                             @Param("startDate") LocalDate startDate,
	                                             @Param("endDate") LocalDate endDate);

	@Query("SELECT l FROM JournalEntryLine l JOIN l.journalEntry j " +
	       "WHERE j.tenantId = :tenantId AND j.status = :status " +
	       "AND l.accountCode = :accountCode " +
	       "AND j.entryDate >= :startDate " +
	       "AND j.entryDate <= :endDate " +
	       "ORDER BY j.entryDate ASC, j.id ASC, l.id ASC")
	List<JournalEntryLine> findLinesByAccountAndDates(@Param("tenantId") Long tenantId,
	                                                  @Param("status") JournalStatus status,
	                                                  @Param("accountCode") String accountCode,
	                                                  @Param("startDate") LocalDate startDate,
	                                                  @Param("endDate") LocalDate endDate);

	default List<JournalEntryLine> findFilteredPostedLines(Long tenantId,
	                                                       JournalStatus status,
	                                                       String accountCode,
	                                                       LocalDate startDate,
	                                                       LocalDate endDate) {
		LocalDate effectiveStart = (startDate != null) ? startDate : LocalDate.of(1970, 1, 1);
		LocalDate effectiveEnd = (endDate != null) ? endDate : LocalDate.of(2099, 12, 31);
		String cleanCode = (accountCode != null && !accountCode.trim().isEmpty()) ? accountCode.trim() : null;

		if (cleanCode != null) {
			return findLinesByAccountAndDates(tenantId, status, cleanCode, effectiveStart, effectiveEnd);
		} else {
			return findLinesBetweenDates(tenantId, status, effectiveStart, effectiveEnd);
		}
	}
}
