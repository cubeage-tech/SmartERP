package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.response.StockMovementResponse;
import java.util.List;

public interface StockMovementService {
	List<StockMovementResponse> recent(Long tenantId);
}
