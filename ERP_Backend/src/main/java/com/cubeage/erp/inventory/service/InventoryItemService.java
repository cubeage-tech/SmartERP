package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.request.CreateInventoryItemRequest;
import com.cubeage.erp.inventory.dto.request.UpdateInventoryItemRequest;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;
import java.util.List;

public interface InventoryItemService {
	InventoryItemResponse create(Long tenantId, CreateInventoryItemRequest request);
	InventoryItemResponse update(Long tenantId, Long id, UpdateInventoryItemRequest request);
	InventoryItemResponse get(Long tenantId, Long id);
	List<InventoryItemResponse> all(Long tenantId, String search, String status);
	void delete(Long tenantId, Long id);
}
