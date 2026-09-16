package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {

    List<PerformanceReview> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<PerformanceReview> findByTenantIdAndReviewPeriod(Long tenantId, String reviewPeriod);
}
