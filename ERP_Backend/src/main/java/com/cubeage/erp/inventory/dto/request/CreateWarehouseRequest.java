package com.cubeage.erp.inventory.dto.request;

import jakarta.validation.constraints.*;

public record CreateWarehouseRequest(
	@NotBlank @Size(max = 30) String code,
	@NotBlank @Size(max = 100) String name,
	@NotBlank @Size(max = 150) String location,
	@NotBlank @Size(max = 30) String area,
	@NotNull @Min(0) @Max(100) Integer capacityPercent) {
}
