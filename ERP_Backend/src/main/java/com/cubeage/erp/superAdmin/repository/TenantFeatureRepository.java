package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.TenantFeature;
import com.cubeage.erp.superAdmin.enums.FeatureStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TenantFeatureRepository extends JpaRepository<TenantFeature, Long> {
    List<TenantFeature> findByTenantId(Long tenantId);
    Optional<TenantFeature> findByTenantIdAndFeatureKey(Long tenantId, String featureKey);
    List<TenantFeature> findByTenantIdAndStatus(Long tenantId, FeatureStatus status);
}
