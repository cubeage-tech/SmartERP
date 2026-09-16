package com.cubeage.erp.inventory.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StockMovementResponse(Long id, LocalDate date, String sku, String item, String type,
									BigDecimal quantity, String unit, String warehouse, String reference) {
}
