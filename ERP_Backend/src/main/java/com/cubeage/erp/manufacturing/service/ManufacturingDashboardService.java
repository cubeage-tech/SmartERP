package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.response.ManufacturingDashboardResponse;

public interface ManufacturingDashboardService {

    ManufacturingDashboardResponse getDashboard(Long tenantId);
}