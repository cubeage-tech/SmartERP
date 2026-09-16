package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.journal.CreateJournalEntryRequest;
import com.cubeage.erp.finance.dto.journal.JournalEntryResponse;
import java.time.LocalDate;
import java.util.List;

public interface JournalEntryService {
	JournalEntryResponse create(Long tenantId, CreateJournalEntryRequest request);
	List<JournalEntryResponse> all(Long tenantId);
	JournalEntryResponse getById(Long tenantId, Long id);
	List<JournalEntryResponse> search(Long tenantId, LocalDate startDate, LocalDate endDate, String search, String accountCode, String status);
}
