package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.balancesheet.BalanceSheetResponse;
import com.cubeage.erp.finance.dto.balancesheet.TrialBalanceResponse;
import java.time.LocalDate;

public interface BalanceSheetService {

	BalanceSheetResponse getBalanceSheet(Long tenantId, LocalDate asOfDate);

	TrialBalanceResponse getTrialBalance(Long tenantId, LocalDate asOfDate);
}
