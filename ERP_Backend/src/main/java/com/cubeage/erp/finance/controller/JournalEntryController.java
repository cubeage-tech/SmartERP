package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.journal.*;
import com.cubeage.erp.finance.service.JournalEntryService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController 
@RequestMapping("/api/v1/finance/journals") 
@RequiredArgsConstructor
public class JournalEntryController {

	private final JournalEntryService service;

	@PostMapping 
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','FINANCE_MANAGER')")
	public JournalEntryResponse create(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@Valid @RequestBody CreateJournalEntryRequest request
	) {
		return service.create(FinanceTenantResolver.resolveTenantId(tenantId), request);
	}

	@GetMapping 
	@PreAuthorize("isAuthenticated()")
	public List<JournalEntryResponse> all(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
			@RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String accountCode,
			@RequestParam(required = false) String status
	) {
		Long resolvedTenant = FinanceTenantResolver.resolveTenantId(tenantId);
		if (startDate != null || endDate != null || search != null || accountCode != null || status != null) {
			return service.search(resolvedTenant, startDate, endDate, search, accountCode, status);
		}
		return service.all(resolvedTenant);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','FINANCE_MANAGER')")
	public JournalEntryResponse getById(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@PathVariable Long id
	) {
		return service.getById(FinanceTenantResolver.resolveTenantId(tenantId), id);
	}
}
