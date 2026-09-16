package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.response.StockMovementResponse;
import com.cubeage.erp.inventory.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory/movements")
public class StockMovementController {
	private final StockMovementService service;

	public StockMovementController(StockMovementService service) {
		this.service = service;
	}

	@GetMapping 
	@PreAuthorize("isAuthenticated()")
	public List<StockMovementResponse> recent(@RequestHeader("X-Tenant-Id") Long tenantId) { return service.recent(tenantId); }
}
