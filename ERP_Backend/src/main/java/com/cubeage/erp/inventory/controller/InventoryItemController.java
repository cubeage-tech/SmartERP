package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.request.*;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;
import com.cubeage.erp.inventory.service.InventoryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryItemController {
	private final InventoryItemService service;

	public InventoryItemController(InventoryItemService service) {
		this.service = service;
	}

	@PostMapping 
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public InventoryItemResponse create(@RequestHeader("X-Tenant-Id") Long tenantId, @Valid @RequestBody CreateInventoryItemRequest request) {
		return service.create(tenantId, request);
	}

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<InventoryItemResponse> all(@RequestHeader("X-Tenant-Id") Long tenantId,
										   @RequestParam(required = false) String search,
										   @RequestParam(required = false) String status) {
		return service.all(tenantId, search, status);
	}

	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public InventoryItemResponse get(@RequestHeader("X-Tenant-Id") Long tenantId, @PathVariable Long id) {
		return service.get(tenantId, id);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public InventoryItemResponse update(@RequestHeader("X-Tenant-Id") Long tenantId, @PathVariable Long id,
										 @Valid @RequestBody UpdateInventoryItemRequest request) {
		return service.update(tenantId, id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public void delete(@RequestHeader("X-Tenant-Id") Long tenantId, @PathVariable Long id) {
		service.delete(tenantId, id);
	}
}
