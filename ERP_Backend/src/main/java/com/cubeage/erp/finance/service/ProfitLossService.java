package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.profitloss.ProfitLossResponse;
import java.time.LocalDate;

public interface ProfitLossService {
	ProfitLossResponse getProfitLoss(Long tenantId, LocalDate startDate, LocalDate endDate);
}
