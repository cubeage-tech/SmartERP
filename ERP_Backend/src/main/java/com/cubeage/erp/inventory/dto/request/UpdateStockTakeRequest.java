package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.Valid;
import java.util.List;

public record UpdateStockTakeRequest(
	String title,
	String notes,
	@Valid List<StockTakeItemRequest> items
) {
}
