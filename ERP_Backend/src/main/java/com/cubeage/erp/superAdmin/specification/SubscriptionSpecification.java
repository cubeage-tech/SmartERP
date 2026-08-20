package com.cubeage.erp.superAdmin.specification;

import com.cubeage.erp.superAdmin.entity.Subscription;
import com.cubeage.erp.superAdmin.enums.SubscriptionStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class SubscriptionSpecification {

    public static Specification<Subscription> byTenantAndStatus(Long tenantId, SubscriptionStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (tenantId != null) predicates.add(cb.equal(root.get("tenantId"), tenantId));
            if (status != null) predicates.add(cb.equal(root.get("status"), status));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Subscription> expiringBefore(Instant date) {
        return (root, query, cb) -> cb.lessThan(root.get("endsAt"), date);
    }
}
