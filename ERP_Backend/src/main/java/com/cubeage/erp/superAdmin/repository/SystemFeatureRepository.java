package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.SystemFeature;
import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SystemFeatureRepository extends JpaRepository<SystemFeature, Long> {
    Optional<SystemFeature> findByFeatureKey(String featureKey);
    List<SystemFeature> findByStatus(FeatureStatus status);
    List<SystemFeature> findByModule(String module);
    boolean existsByFeatureKey(String featureKey);
}
