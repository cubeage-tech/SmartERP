package com.cubeage.erp.manufacturing.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BomResponse(
        Long id,
        String bomNumber,
        String product,
        String version,
        Integer components,
        BigDecimal cost,
        String formattedCost,
        String notes,
        LocalDateTime updatedAt
) {}