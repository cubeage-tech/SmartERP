package com.cubeage.erp.finance.repository;

import com.cubeage.erp.finance.entity.FinanceAlert;
import com.cubeage.erp.finance.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FinanceAlertRepository extends JpaRepository<FinanceAlert, Long> {
	List<FinanceAlert> findByTenantIdAndStatusOrderByCreatedAtDesc(Long tenantId, AlertStatus status);
	Optional<FinanceAlert> findByIdAndTenantId(Long id, Long tenantId);
}
