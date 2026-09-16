package com.cubeage.erp.manufacturing.dto.response;

import java.math.BigDecimal;

public record BomItemResponse(
        Long id,
        Long productId,
        String description,
        BigDecimal quantity,
        BigDecimal unitCost,
        BigDecimal lineTotal
) {}