package com.cubeage.erp.manufacturing.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record BomDetailsResponse(
        Long id,
        String bomNumber,
        String product,
        String version,
        Integer components,
        BigDecimal cost,
        String formattedCost,
        String notes,
        Map<String, Object> details,
        List<BomItemResponse> items,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}