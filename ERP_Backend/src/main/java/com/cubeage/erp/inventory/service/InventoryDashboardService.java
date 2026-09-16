package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.response.InventoryDashboardResponse;

public interface InventoryDashboardService {
	InventoryDashboardResponse summary(Long tenantId);
}
