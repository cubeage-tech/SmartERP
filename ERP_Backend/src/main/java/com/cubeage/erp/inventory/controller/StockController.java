package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.request.StockAdjustmentRequest;
import com.cubeage.erp.inventory.dto.request.StockTransferRequest;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;
import com.cubeage.erp.inventory.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory/stock")
public class StockController {
	private final StockService service;

	public StockController(StockService service) {
		this.service = service;
	}

	@PostMapping("/adjust")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public InventoryItemResponse adjustStock(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@Valid @RequestBody StockAdjustmentRequest request) {
		return service.adjustStock(tenantId, request);
	}

	@PostMapping("/transfer")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public InventoryItemResponse transferStock(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@Valid @RequestBody StockTransferRequest request) {
		return service.transferStock(tenantId, request);
	}
}
