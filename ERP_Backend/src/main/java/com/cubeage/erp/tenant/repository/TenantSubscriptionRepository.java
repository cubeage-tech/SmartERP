package com.cubeage.erp.tenant.repository;

import com.cubeage.erp.tenant.entity.TenantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantSubscriptionRepository extends JpaRepository<TenantSubscription, Long> {
    List<TenantSubscription> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    Optional<TenantSubscription> findFirstByTenantIdAndActiveTrueOrderByCreatedAtDesc(Long tenantId);
}
