package com.cubeage.erp.inventory.dto.response;

import java.math.BigDecimal;

public record ReplenishmentRecommendationResponse(
	Long itemId,
	String sku,
	String name,
	String category,
	String warehouseCode,
	String warehouseName,
	BigDecimal currentQuantity,
	BigDecimal minimumLevel,
	BigDecimal suggestedQuantity,
	String unit,
	BigDecimal costPrice,
	BigDecimal estimatedCost,
	String status,
	String urgency,
	String supplier
) {
}
