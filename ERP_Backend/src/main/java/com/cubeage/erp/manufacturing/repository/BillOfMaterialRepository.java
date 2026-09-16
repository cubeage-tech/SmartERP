package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.BillOfMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillOfMaterialRepository extends JpaRepository<BillOfMaterial, Long> {

    Optional<BillOfMaterial> findByIdAndTenantId(Long id, Long tenantId);

    Optional<BillOfMaterial> findByBomNumberAndTenantId(String bomNumber, Long tenantId);

    List<BillOfMaterial> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    long countByTenantId(Long tenantId);
}