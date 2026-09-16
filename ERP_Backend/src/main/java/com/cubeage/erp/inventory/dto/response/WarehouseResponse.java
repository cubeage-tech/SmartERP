package com.cubeage.erp.inventory.dto.response;

public record WarehouseResponse(Long id, String code, String name, String location, String area,
								Integer capacityPercent, long skuCount, String value, boolean active) {
}
