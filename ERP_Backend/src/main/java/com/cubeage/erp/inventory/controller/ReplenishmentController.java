package com.cubeage.erp.inventory.controller;

import com.cubeage.erp.inventory.dto.response.ReplenishmentRecommendationResponse;
import com.cubeage.erp.inventory.service.ReplenishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory/replenishment")
public class ReplenishmentController {
	private final ReplenishmentService service;

	public ReplenishmentController(ReplenishmentService service) {
		this.service = service;
	}

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<ReplenishmentRecommendationResponse> getRecommendations(
			@RequestHeader("X-Tenant-Id") Long tenantId) {
		return service.recommendations(tenantId);
	}
}
