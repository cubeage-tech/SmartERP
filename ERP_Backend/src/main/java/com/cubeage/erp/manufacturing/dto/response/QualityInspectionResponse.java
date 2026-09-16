package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.QualityInspectionType;
import com.cubeage.erp.manufacturing.enums.QualityResult;

import java.time.LocalDateTime;

public record QualityInspectionResponse(
        Long id,
        String workOrderNumber,
        String productName,
        QualityInspectionType type,
        QualityResult result,
        Integer quantity,
        String reason,
        String inspectorName,
        LocalDateTime createdAt
) {}