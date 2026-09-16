package com.cubeage.erp.inventory.repository;

import com.cubeage.erp.inventory.entity.StockTake;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StockTakeRepository extends JpaRepository<StockTake, Long> {
	List<StockTake> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
	Optional<StockTake> findByIdAndTenantId(Long id, Long tenantId);
	Optional<StockTake> findByTenantIdAndCodeIgnoreCase(Long tenantId, String code);
}
