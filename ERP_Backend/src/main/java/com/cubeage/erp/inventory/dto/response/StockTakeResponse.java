package com.cubeage.erp.inventory.dto.response;

import com.cubeage.erp.inventory.enums.StockTakeStatus;

import java.time.LocalDate;
import java.util.List;

public record StockTakeResponse(
	Long id,
	String code,
	String title,
	String warehouseCode,
	String warehouseName,
	StockTakeStatus status,
	LocalDate scheduledDate,
	LocalDate completedDate,
	String notes,
	int totalItems,
	int matchedItems,
	int varianceItems,
	List<StockTakeItemResponse> items
) {
}
