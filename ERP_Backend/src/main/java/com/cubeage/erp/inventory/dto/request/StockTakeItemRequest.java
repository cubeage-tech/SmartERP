package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record StockTakeItemRequest(
	@NotNull Long id,
	@NotNull @DecimalMin("0") BigDecimal countedQuantity,
	@Size(max = 255) String notes
) {
}
