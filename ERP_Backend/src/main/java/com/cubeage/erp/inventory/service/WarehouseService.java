package com.cubeage.erp.inventory.service;

import com.cubeage.erp.inventory.dto.request.CreateWarehouseRequest;
import com.cubeage.erp.inventory.dto.response.WarehouseResponse;
import java.util.List;

public interface WarehouseService {
	List<WarehouseResponse> all(Long tenantId);
	WarehouseResponse create(Long tenantId, CreateWarehouseRequest request);
}
