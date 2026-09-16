package com.cubeage.erp.finance.repository;

import com.cubeage.erp.finance.entity.Account;
import com.cubeage.erp.finance.enums.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

	List<Account> findByTenantIdOrderByIdAsc(Long tenantId);

	List<Account> findByTenantIdAndActiveTrue(Long tenantId);

	List<Account> findByTenantIdAndActiveOrderByIdAsc(Long tenantId, boolean active);

	List<Account> findByTenantIdAndType(Long tenantId, AccountType type);

	List<Account> findByTenantIdAndTypeOrderByIdAsc(Long tenantId, AccountType type);

	List<Account> findByTenantIdAndTypeAndActiveOrderByIdAsc(Long tenantId, AccountType type, boolean active);

	Optional<Account> findByTenantIdAndCode(Long tenantId, String code);

	Optional<Account> findByTenantIdAndCodeIgnoreCase(Long tenantId, String code);

	boolean existsByTenantIdAndCode(Long tenantId, String code);

	boolean existsByTenantIdAndCodeIgnoreCase(Long tenantId, String code);

	long countByTenantId(Long tenantId);

	@Query("SELECT a FROM Account a WHERE a.tenantId = :tenantId " +
	       "AND (LOWER(a.code) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
	       "ORDER BY a.id ASC")
	List<Account> searchAccounts(@Param("tenantId") Long tenantId, @Param("search") String search);
}
