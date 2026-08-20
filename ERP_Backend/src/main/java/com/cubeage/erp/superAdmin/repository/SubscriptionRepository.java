package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.Subscription;
import com.cubeage.erp.superAdmin.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, JpaSpecificationExecutor<Subscription> {
    List<Subscription> findByTenantId(Long tenantId);
    Optional<Subscription> findByTenantIdAndStatus(Long tenantId, SubscriptionStatus status);
    List<Subscription> findByStatus(SubscriptionStatus status);
    List<Subscription> findByEndsAtBeforeAndStatus(Instant date, SubscriptionStatus status);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Subscription s WHERE s.status = 'ACTIVE'")
    BigDecimal sumActiveRevenue();
}
