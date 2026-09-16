package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record StockTransferRequest(
	@NotNull Long itemId,
	@NotBlank @Size(max = 30) String targetWarehouseCode,
	@NotBlank @Size(max = 100) String targetWarehouseName,
	@NotNull @DecimalMin("0.001") BigDecimal quantity,
	@Size(max = 100) String reference
) {
}
