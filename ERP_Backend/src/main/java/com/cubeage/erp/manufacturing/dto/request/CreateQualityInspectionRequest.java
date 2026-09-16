package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.QualityInspectionType;
import com.cubeage.erp.manufacturing.enums.QualityResult;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateQualityInspectionRequest(
        @NotBlank String workOrderNumber,
        @NotBlank String productName,
        @NotNull QualityInspectionType type,
        @NotNull QualityResult result,
        @NotNull @Min(1) Integer quantity,
        String reason,
        String inspectorName
) {}