package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.QualityInspection;
import com.cubeage.erp.manufacturing.enums.QualityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QualityInspectionRepository extends JpaRepository<QualityInspection, Long> {

    List<QualityInspection> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<QualityInspection> findTop5ByTenantIdAndResultInOrderByCreatedAtDesc(Long tenantId, List<QualityResult> results);

    long countByTenantIdAndResult(Long tenantId, QualityResult result);

    long countByTenantId(Long tenantId);
}