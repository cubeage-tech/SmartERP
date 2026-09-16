package com.cubeage.erp.finance.service;

import java.time.LocalDate;

public interface TallyExportService {
	String exportChartOfAccountsXml(Long tenantId);
	String exportDaybookXml(Long tenantId, LocalDate startDate, LocalDate endDate);
}
