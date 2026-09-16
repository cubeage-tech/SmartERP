package com.cubeage.erp.inventory.repository;

import com.cubeage.erp.inventory.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
	List<Warehouse> findByTenantIdAndActiveTrueOrderByCodeAsc(Long tenantId);
	Optional<Warehouse> findByTenantIdAndCodeIgnoreCase(Long tenantId, String code);
}
