package com.cubeage.erp.inventory.repository;

import com.cubeage.erp.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
	Optional<InventoryItem> findByIdAndTenantId(Long id, Long tenantId);
	Optional<InventoryItem> findByTenantIdAndSkuIgnoreCase(Long tenantId, String sku);
	List<InventoryItem> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
}
