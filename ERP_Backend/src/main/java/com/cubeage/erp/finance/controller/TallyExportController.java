package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.service.TallyExportService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/finance/export/tally")
@RequiredArgsConstructor
public class TallyExportController {

	private final TallyExportService tallyExportService;

	@GetMapping("/masters")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','FINANCE_MANAGER')")
	public ResponseEntity<byte[]> exportMasters(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantHeader
	) {
		Long tenantId = FinanceTenantResolver.resolveTenantId(tenantHeader);
		String xml = tallyExportService.exportChartOfAccountsXml(tenantId);
		byte[] bytes = xml.getBytes(StandardCharsets.UTF_8);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Tally_Masters.xml\"")
				.contentType(MediaType.APPLICATION_XML)
				.body(bytes);
	}

	@GetMapping("/daybook")
	@PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','FINANCE_MANAGER')")
	public ResponseEntity<byte[]> exportDaybook(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantHeader,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
	) {
		Long tenantId = FinanceTenantResolver.resolveTenantId(tenantHeader);
		String xml = tallyExportService.exportDaybookXml(tenantId, startDate, endDate);
		byte[] bytes = xml.getBytes(StandardCharsets.UTF_8);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Tally_Daybook.xml\"")
				.contentType(MediaType.APPLICATION_XML)
				.body(bytes);
	}
}
