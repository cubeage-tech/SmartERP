package com.cubeage.erp.superAdmin.specification;

import com.cubeage.erp.superAdmin.dto.tenant.TenantSearchRequest;
import com.cubeage.erp.superAdmin.entity.Tenant;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TenantSpecification {

    public static Specification<Tenant> from(TenantSearchRequest req) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (req.keyword() != null && !req.keyword().isBlank()) {
                String like = "%" + req.keyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("code")), like),
                        cb.like(cb.lower(root.get("contactEmail")), like)
                ));
            }
            if (req.status() != null) predicates.add(cb.equal(root.get("status"), req.status()));
            if (req.planType() != null) predicates.add(cb.equal(root.get("planType"), req.planType()));
            if (req.country() != null) predicates.add(cb.equal(root.get("country"), req.country()));
            if (req.industry() != null) predicates.add(cb.equal(root.get("industry"), req.industry()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
