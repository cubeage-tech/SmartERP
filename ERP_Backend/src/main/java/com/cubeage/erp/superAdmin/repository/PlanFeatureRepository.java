package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.PlanFeature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanFeatureRepository extends JpaRepository<PlanFeature, Long> {
    List<PlanFeature> findByPlanId(Long planId);
    void deleteByPlanId(Long planId);
}
