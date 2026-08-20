package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.BillingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BillingHistoryRepository extends JpaRepository<BillingHistory, Long> { List<BillingHistory> findByTenantIdOrderByCreatedAtDesc(Long tenantId); }
