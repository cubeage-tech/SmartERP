package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.alert.FinanceAlertResponse;
import java.util.List;

public interface FinanceAlertService {
	List<FinanceAlertResponse> active(Long tenantId);
	void dismiss(Long tenantId, Long id);
}
