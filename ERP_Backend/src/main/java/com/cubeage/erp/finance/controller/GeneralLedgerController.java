package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.ledger.GeneralLedgerResponse;
import com.cubeage.erp.finance.service.GeneralLedgerService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/finance/ledger")
@RequiredArgsConstructor
public class GeneralLedgerController {

	private final GeneralLedgerService service;

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public GeneralLedgerResponse getLedger(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestParam(required = false) String accountCode,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
	) {
		return service.getLedger(
				FinanceTenantResolver.resolveTenantId(tenantId),
				accountCode,
				startDate,
				endDate
		);
	}
}
