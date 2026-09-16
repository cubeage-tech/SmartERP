package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record StockAdjustmentRequest(
	@NotNull Long itemId,
	@NotNull @DecimalMin("0") BigDecimal newQuantity,
	@NotBlank @Size(max = 255) String reason,
	@Size(max = 100) String reference
) {
}
