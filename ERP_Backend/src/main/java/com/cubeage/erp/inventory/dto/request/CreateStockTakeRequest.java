package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateStockTakeRequest(
	@NotBlank @Size(max = 150) String title,
	@NotBlank @Size(max = 30) String warehouseCode,
	@NotBlank @Size(max = 100) String warehouseName,
	@NotNull LocalDate scheduledDate,
	String notes,
	List<Long> itemIds
) {
}
