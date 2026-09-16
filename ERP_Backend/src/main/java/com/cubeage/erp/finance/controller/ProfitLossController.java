package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.profitloss.ProfitLossResponse;
import com.cubeage.erp.finance.service.ProfitLossService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/finance/profit-loss")
@RequiredArgsConstructor
public class ProfitLossController {

	private final ProfitLossService service;

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public ProfitLossResponse getProfitLoss(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
	) {
		return service.getProfitLoss(
				FinanceTenantResolver.resolveTenantId(tenantId),
				startDate,
				endDate
		);
	}
}
