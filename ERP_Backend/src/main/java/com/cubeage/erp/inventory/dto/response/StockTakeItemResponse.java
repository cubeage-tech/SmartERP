package com.cubeage.erp.inventory.dto.response;

import java.math.BigDecimal;

public record StockTakeItemResponse(
	Long id,
	Long itemId,
	String sku,
	String itemName,
	String unit,
	BigDecimal systemQuantity,
	BigDecimal countedQuantity,
	BigDecimal variance,
	String notes
) {
}
