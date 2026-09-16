package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.ProductionPriority;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateProductionScheduleRequest(
        @NotNull Long workOrderId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotNull ProductionPriority priority
) {}