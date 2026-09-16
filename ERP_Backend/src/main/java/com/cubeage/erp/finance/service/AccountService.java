package com.cubeage.erp.finance.service;

import com.cubeage.erp.finance.dto.account.AccountResponse;
import com.cubeage.erp.finance.dto.account.CreateAccountRequest;
import com.cubeage.erp.finance.dto.account.UpdateAccountRequest;
import com.cubeage.erp.finance.enums.AccountType;

import java.util.List;

public interface AccountService {
	List<AccountResponse> listAccounts(Long tenantId, AccountType type, Boolean active, String search);
	AccountResponse createAccount(Long tenantId, CreateAccountRequest request);
	AccountResponse updateAccount(Long tenantId, Long id, UpdateAccountRequest request);
	AccountResponse getAccountByCode(Long tenantId, String code);
	void initDefaultAccountsIfEmpty(Long tenantId);
}
