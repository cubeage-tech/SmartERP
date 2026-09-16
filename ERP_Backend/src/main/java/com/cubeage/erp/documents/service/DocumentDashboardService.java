package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.dashboard.DocumentDashboardResponse;

public interface DocumentDashboardService {
    DocumentDashboardResponse getDashboard(Long tenantId);
}