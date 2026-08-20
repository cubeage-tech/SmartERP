package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.Subscription;
import com.cubeage.erp.settings.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findFirstByTenantIdAndStatusInOrderByCreatedAtDesc(Long tenantId, Collection<SubscriptionStatus> statuses);
    List<Subscription> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
}
