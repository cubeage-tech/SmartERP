package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.dashboard.FinanceDashboardResponse;
import com.cubeage.erp.finance.repository.JournalEntryRepository;
import com.cubeage.erp.finance.service.FinanceDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service @RequiredArgsConstructor
public class FinanceDashboardServiceImpl implements FinanceDashboardService {
	private final JournalEntryRepository repository;
	@Override @Transactional(readOnly = true)
	public FinanceDashboardResponse summary(Long tenantId) {
		var entries = repository.findByTenantIdOrderByEntryDateDescIdDesc(tenantId);
		BigDecimal debit = entries.stream().flatMap(entry -> entry.getLines().stream()).map(line -> line.getDebit()).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal credit = entries.stream().flatMap(entry -> entry.getLines().stream()).map(line -> line.getCredit()).reduce(BigDecimal.ZERO, BigDecimal::add);
		return new FinanceDashboardResponse(entries.size(), debit, credit, credit.subtract(debit));
	}
}
