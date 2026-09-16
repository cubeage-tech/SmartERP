package com.cubeage.erp.inventory.repository;

import com.cubeage.erp.inventory.entity.StockTakeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockTakeItemRepository extends JpaRepository<StockTakeItem, Long> {
	List<StockTakeItem> findByTenantIdAndStockTakeId(Long tenantId, Long stockTakeId);
}
