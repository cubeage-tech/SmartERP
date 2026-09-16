package com.cubeage.erp.finance.controller;

import com.cubeage.erp.finance.dto.account.AccountResponse;
import com.cubeage.erp.finance.dto.account.CreateAccountRequest;
import com.cubeage.erp.finance.dto.account.UpdateAccountRequest;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.service.AccountService;
import com.cubeage.erp.finance.util.FinanceTenantResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance/accounts")
@RequiredArgsConstructor
public class AccountController {

	private final AccountService service;

	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public List<AccountResponse> listAccounts(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestParam(required = false) AccountType type,
			@RequestParam(required = false) Boolean active,
			@RequestParam(required = false) String search
	) {
		Long resolvedTenantId = FinanceTenantResolver.resolveTenantId(tenantId);
		service.initDefaultAccountsIfEmpty(resolvedTenantId);
		return service.listAccounts(resolvedTenantId, type, active, search);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("isAuthenticated()")
	public AccountResponse createAccount(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@RequestBody CreateAccountRequest request
	) {
		Long resolvedTenantId = FinanceTenantResolver.resolveTenantId(tenantId);
		return service.createAccount(resolvedTenantId, request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public AccountResponse updateAccount(
			@RequestHeader(value = "X-Tenant-Id", required = false) Long tenantId,
			@PathVariable Long id,
			@RequestBody UpdateAccountRequest request
	) {
		Long resolvedTenantId = FinanceTenantResolver.resolveTenantId(tenantId);
		return service.updateAccount(resolvedTenantId, id, request);
	}
}
