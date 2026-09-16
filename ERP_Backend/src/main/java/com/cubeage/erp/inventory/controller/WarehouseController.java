package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.request.CreateWarehouseRequest;
import com.cubeage.erp.inventory.dto.response.WarehouseResponse;
import com.cubeage.erp.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory/warehouses")
public class WarehouseController {
	private final WarehouseService service;

	public WarehouseController(WarehouseService service) {
		this.service = service;
	}

	@GetMapping 
	@PreAuthorize("isAuthenticated()")
	public List<WarehouseResponse> all(@RequestHeader("X-Tenant-Id") Long tenantId) { return service.all(tenantId); }

	@PostMapping 
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','INVENTORY_MANAGER')")
	public WarehouseResponse create(@RequestHeader("X-Tenant-Id") Long tenantId,
									 @Valid @RequestBody CreateWarehouseRequest request) {
		return service.create(tenantId, request);
	}
}
