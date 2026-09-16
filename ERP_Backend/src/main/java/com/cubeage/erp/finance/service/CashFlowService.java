package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.cashflow.CashFlowResponse;

public interface CashFlowService {
	CashFlowResponse getCashFlow(Long tenantId, Integer year);
}
