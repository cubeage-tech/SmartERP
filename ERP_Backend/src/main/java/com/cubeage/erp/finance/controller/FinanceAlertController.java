package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.alert.FinanceAlertResponse;
import com.cubeage.erp.finance.service.FinanceAlertService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController 
@RequestMapping("/api/v1/finance/alerts") 
@RequiredArgsConstructor
public class FinanceAlertController {

	private final FinanceAlertService service;

	@GetMapping 
	@PreAuthorize("isAuthenticated()")
	public List<FinanceAlertResponse> active(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId
	) {
		return service.active(FinanceTenantResolver.resolveTenantId(tenantId));
	}

	@DeleteMapping("/{id}") 
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','FINANCE_MANAGER')")
	public void dismiss(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@PathVariable Long id
	) {
		service.dismiss(FinanceTenantResolver.resolveTenantId(tenantId), id);
	}
}
