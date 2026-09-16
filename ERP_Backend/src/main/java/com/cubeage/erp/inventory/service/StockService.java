package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.request.StockAdjustmentRequest;
import com.cubeage.erp.inventory.dto.request.StockTransferRequest;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;

public interface StockService {
	InventoryItemResponse adjustStock(Long tenantId, StockAdjustmentRequest request);
	InventoryItemResponse transferStock(Long tenantId, StockTransferRequest request);
}
