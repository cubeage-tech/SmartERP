package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.response.InventoryDashboardResponse;
import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.repository.WarehouseRepository;
import com.cubeage.erp.inventory.service.InventoryDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class InventoryDashboardServiceImpl implements InventoryDashboardService {
    private final InventoryItemRepository itemRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryDashboardServiceImpl(InventoryItemRepository itemRepository, WarehouseRepository warehouseRepository) {
        this.itemRepository = itemRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Override @Transactional(readOnly = true)
    public InventoryDashboardResponse summary(Long tenantId) {
        var items = itemRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        BigDecimal value = items.stream().map(item -> item.getQuantity().multiply(item.getCostPrice())).reduce(BigDecimal.ZERO, BigDecimal::add);
        long low = items.stream().filter(item -> item.getQuantity().signum() > 0 && item.getQuantity().compareTo(item.getMinimumLevel()) < 0).count();
        long empty = items.stream().filter(item -> item.getQuantity().signum() == 0).count();
        return new InventoryDashboardResponse(items.size(), value, low, empty, warehouseRepository.findByTenantIdAndActiveTrueOrderByCodeAsc(tenantId).size());
    }
}
