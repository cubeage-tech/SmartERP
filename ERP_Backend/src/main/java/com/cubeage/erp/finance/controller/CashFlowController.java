package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.cashflow.CashFlowResponse;
import com.cubeage.erp.finance.service.CashFlowService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/finance/cash-flow")
@RequiredArgsConstructor
public class CashFlowController {

	private final CashFlowService service;

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public CashFlowResponse getCashFlow(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestParam(required = false) Integer year
	) {
		return service.getCashFlow(
				FinanceTenantResolver.resolveTenantId(tenantId),
				year
		);
	}
}
