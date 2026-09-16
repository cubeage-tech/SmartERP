package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.request.CreateStockTakeRequest;
import com.cubeage.erp.inventory.dto.request.UpdateStockTakeRequest;
import com.cubeage.erp.inventory.dto.response.StockTakeResponse;
import com.cubeage.erp.inventory.service.StockTakeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory/stock-takes")
public class StockTakeController {
	private final StockTakeService service;

	public StockTakeController(StockTakeService service) {
		this.service = service;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public StockTakeResponse create(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@Valid @RequestBody CreateStockTakeRequest request) {
		return service.create(tenantId, request);
	}

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<StockTakeResponse> all(@RequestHeader("X-Tenant-Id") Long tenantId) {
		return service.all(tenantId);
	}

	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public StockTakeResponse get(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@PathVariable Long id) {
		return service.get(tenantId, id);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public StockTakeResponse update(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@PathVariable Long id,
			@Valid @RequestBody UpdateStockTakeRequest request) {
		return service.update(tenantId, id, request);
	}

	@PostMapping("/{id}/finalize")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public StockTakeResponse finalizeStockTake(
			@RequestHeader("X-Tenant-Id") Long tenantId,
			@PathVariable Long id) {
		return service.finalizeStockTake(tenantId, id);
	}
}
