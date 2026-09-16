package com.cubeage.erp.inventory.dto.response;

import java.math.BigDecimal;

public record InventoryDashboardResponse(long totalSkus, BigDecimal stockValue, long lowStockItems,
										 long outOfStockItems, long warehouseCount) {
}
