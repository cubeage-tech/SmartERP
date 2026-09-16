package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.ledger.GeneralLedgerResponse;
import java.time.LocalDate;

public interface GeneralLedgerService {
	GeneralLedgerResponse getLedger(Long tenantId, String accountCode, LocalDate startDate, LocalDate endDate);
}
