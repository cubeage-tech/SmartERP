package com.cubeage.erp.reports.service;

import com.cubeage.erp.reports.dto.dashboard.ReportDashboardResponse;

public interface ReportDashboardService {
    ReportDashboardResponse getDashboardData(Long tenantId);
}
