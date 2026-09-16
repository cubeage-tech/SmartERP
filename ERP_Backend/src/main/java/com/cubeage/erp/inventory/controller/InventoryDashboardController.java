package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.response.InventoryDashboardResponse;
import com.cubeage.erp.inventory.service.InventoryDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory/dashboard")
public class InventoryDashboardController {
	private final InventoryDashboardService service;

	public InventoryDashboardController(InventoryDashboardService service) {
		this.service = service;
	}

	@GetMapping @PreAuthorize("isAuthenticated()")
	public InventoryDashboardResponse summary(@RequestHeader("X-Tenant-Id") Long tenantId) { return service.summary(tenantId); }
}
