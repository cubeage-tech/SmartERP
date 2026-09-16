package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.request.CreateStockTakeRequest;
import com.cubeage.erp.inventory.dto.request.UpdateStockTakeRequest;
import com.cubeage.erp.inventory.dto.response.StockTakeResponse;

import java.util.List;

public interface StockTakeService {
	StockTakeResponse create(Long tenantId, CreateStockTakeRequest request);
	List<StockTakeResponse> all(Long tenantId);
	StockTakeResponse get(Long tenantId, Long id);
	StockTakeResponse update(Long tenantId, Long id, UpdateStockTakeRequest request);
	StockTakeResponse finalizeStockTake(Long tenantId, Long id);
}
