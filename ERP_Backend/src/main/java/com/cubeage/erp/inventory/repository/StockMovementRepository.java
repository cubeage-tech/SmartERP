package com.cubeage.erp.inventory.repository;

import com.cubeage.erp.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
	List<StockMovement> findTop50ByTenantIdOrderByMovementDateDescIdDesc(Long tenantId);
}
