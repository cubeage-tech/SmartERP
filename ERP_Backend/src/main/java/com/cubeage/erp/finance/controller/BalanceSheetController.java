package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.balancesheet.BalanceSheetResponse;
import com.cubeage.erp.finance.dto.balancesheet.TrialBalanceResponse;
import com.cubeage.erp.finance.service.BalanceSheetService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class BalanceSheetController {

	private final BalanceSheetService balanceSheetService;

	@GetMapping("/balance-sheet")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','FINANCE_MANAGER','TENANT_ADMIN')")
	public ResponseEntity<BalanceSheetResponse> getBalanceSheet(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantHeader,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate
	) {
		Long tenantId = FinanceTenantResolver.resolveTenantId(tenantHeader);
		BalanceSheetResponse response = balanceSheetService.getBalanceSheet(tenantId, asOfDate);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/trial-balance")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','FINANCE_MANAGER','TENANT_ADMIN')")
	public ResponseEntity<TrialBalanceResponse> getTrialBalance(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantHeader,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate
	) {
		Long tenantId = FinanceTenantResolver.resolveTenantId(tenantHeader);
		TrialBalanceResponse response = balanceSheetService.getTrialBalance(tenantId, asOfDate);
		return ResponseEntity.ok(response);
	}
}
