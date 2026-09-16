package com.cubeage.erp.finance.service.impl;

import com.cubeage.erp.finance.dto.account.AccountResponse;
import com.cubeage.erp.finance.dto.account.CreateAccountRequest;
import com.cubeage.erp.finance.dto.account.UpdateAccountRequest;
import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.enums.AccountType;
import com.cubeage.erp.finance.exception.AccountNotFoundException;
import com.cubeage.erp.finance.exception.DuplicateAccountCodeException;
import com.cubeage.erp.finance.repository.AccountRepository;
import com.cubeage.erp.finance.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {

	private final AccountRepository repository;

	@Override
	@Transactional(readOnly = true)
	public List<AccountResponse> listAccounts(Long tenantId, AccountType type, Boolean active, String search) {
		List<Account> accounts;

		if (search != null && !search.trim().isEmpty()) {
			accounts = repository.searchAccounts(tenantId, search.trim());
		} else if (type != null && active != null) {
			accounts = repository.findByTenantIdAndTypeAndActiveOrderByIdAsc(tenantId, type, active);
		} else if (type != null) {
			accounts = repository.findByTenantIdAndTypeOrderByIdAsc(tenantId, type);
		} else if (active != null) {
			accounts = repository.findByTenantIdAndActiveOrderByIdAsc(tenantId, active);
		} else {
			accounts = repository.findByTenantIdOrderByIdAsc(tenantId);
		}

		return accounts.stream().map(this::mapToResponse).toList();
	}

	@Override
	public AccountResponse createAccount(Long tenantId, CreateAccountRequest request) {
		if (request.code() == null || request.code().trim().isEmpty()) {
			throw new IllegalArgumentException("Account code cannot be empty");
		}
		if (request.name() == null || request.name().trim().isEmpty()) {
			throw new IllegalArgumentException("Account name cannot be empty");
		}
		if (request.type() == null) {
			throw new IllegalArgumentException("Account type cannot be empty");
		}

		String cleanCode = request.code().trim();
		String cleanName = request.name().trim();

		if (repository.existsByTenantIdAndCodeIgnoreCase(tenantId, cleanCode)) {
			throw new DuplicateAccountCodeException("Account code '" + cleanCode + "' already exists for this tenant");
		}

		Account account = Account.builder()
				.tenantId(tenantId)
				.code(cleanCode)
				.name(cleanName)
				.type(request.type())
				.active(true)
				.build();

		return mapToResponse(repository.save(account));
	}

	@Override
	public AccountResponse updateAccount(Long tenantId, Long id, UpdateAccountRequest request) {
		Account account = repository.findById(id)
				.filter(a -> a.getTenantId().equals(tenantId))
				.orElseThrow(() -> new AccountNotFoundException("Account with ID " + id + " not found for this tenant"));

		if (request.name() != null && !request.name().trim().isEmpty()) {
			account.setName(request.name().trim());
		}
		if (request.active() != null) {
			account.setActive(request.active());
		}

		return mapToResponse(repository.save(account));
	}

	@Override
	@Transactional(readOnly = true)
	public AccountResponse getAccountByCode(Long tenantId, String code) {
		if (code == null || code.trim().isEmpty()) {
			throw new IllegalArgumentException("Account code cannot be empty");
		}
		Account account = repository.findByTenantIdAndCodeIgnoreCase(tenantId, code.trim())
				.orElseThrow(() -> new AccountNotFoundException("Account code '" + code.trim() + "' not found for this tenant"));
		return mapToResponse(account);
	}

	@Override
	public void initDefaultAccountsIfEmpty(Long tenantId) {
		if (repository.countByTenantId(tenantId) == 0) {
			List<Account> defaults = new ArrayList<>();
			defaults.add(Account.builder().tenantId(tenantId).code("1001").name("Cash in Hand").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("1002").name("Cash at Bank").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("1100").name("Accounts Receivable").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("1200").name("Inventory").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("1500").name("Computer Equipment").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("1501").name("Machinery & Equipment").type(AccountType.ASSET).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("2000").name("Accounts Payable").type(AccountType.LIABILITY).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("3000").name("Salary Expense").type(AccountType.EXPENSE).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("3100").name("Rent Expense").type(AccountType.EXPENSE).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("4001").name("Product Sales Revenue").type(AccountType.REVENUE).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("5001").name("Office Expenses").type(AccountType.EXPENSE).active(true).build());
			defaults.add(Account.builder().tenantId(tenantId).code("5002").name("Office Rent Expense").type(AccountType.EXPENSE).active(true).build());
			repository.saveAll(defaults);
		}
	}

	private AccountResponse mapToResponse(Account account) {
		return new AccountResponse(
				account.getId(),
				account.getCode(),
				account.getName(),
				account.getType(),
				account.isActive(),
				account.getCreatedAt(),
				account.getUpdatedAt()
		);
	}
}
