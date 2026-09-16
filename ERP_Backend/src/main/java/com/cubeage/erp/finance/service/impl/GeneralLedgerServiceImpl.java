package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.ledger.GeneralLedgerEntryDto;
import com.cubeage.erp.finance.dto.ledger.GeneralLedgerResponse;
import com.cubeage.erp.finance.entity.JournalEntryLine;
import com.cubeage.erp.finance.enums.JournalStatus;
import com.cubeage.erp.finance.repository.JournalEntryLineRepository;
import com.cubeage.erp.finance.service.GeneralLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GeneralLedgerServiceImpl implements GeneralLedgerService {

	private final JournalEntryLineRepository lineRepository;

	@Override
	public GeneralLedgerResponse getLedger(Long tenantId, String accountCode, LocalDate startDate, LocalDate endDate) {
		String cleanAccountCode = (accountCode != null && !accountCode.trim().isEmpty()) ? accountCode.trim() : null;
		List<JournalEntryLine> lines = lineRepository.findFilteredPostedLines(
				tenantId, JournalStatus.POSTED, cleanAccountCode, startDate, endDate
		);

		List<GeneralLedgerEntryDto> entries = new ArrayList<>(lines.size());
		BigDecimal runningBalance = BigDecimal.ZERO;
		BigDecimal totalDebit = BigDecimal.ZERO;
		BigDecimal totalCredit = BigDecimal.ZERO;

		for (JournalEntryLine line : lines) {
			BigDecimal debit = line.getDebit() != null ? line.getDebit() : BigDecimal.ZERO;
			BigDecimal credit = line.getCredit() != null ? line.getCredit() : BigDecimal.ZERO;

			runningBalance = runningBalance.add(debit).subtract(credit);
			totalDebit = totalDebit.add(debit);
			totalCredit = totalCredit.add(credit);

			entries.add(new GeneralLedgerEntryDto(
					line.getId(),
					line.getJournalEntry().getEntryNumber(),
					line.getJournalEntry().getEntryDate(),
					line.getJournalEntry().getDescription(),
					line.getJournalEntry().getReference(),
					line.getAccountCode(),
					line.getAccountName(),
					debit,
					credit,
					runningBalance
			));
		}

		BigDecimal netBalance = totalDebit.subtract(totalCredit);
		return new GeneralLedgerResponse(entries, totalDebit, totalCredit, netBalance, entries.size());
	}
}
