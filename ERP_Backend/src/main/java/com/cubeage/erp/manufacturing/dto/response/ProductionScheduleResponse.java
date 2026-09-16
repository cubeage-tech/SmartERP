package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.ProductionPriority;
import com.cubeage.erp.manufacturing.enums.ProductionScheduleStatus;

import java.time.LocalDate;

public record ProductionScheduleResponse(
        Long id,
        Long workOrderId,
        String workOrderNumber,
        String title,
        LocalDate startDate,
        LocalDate endDate,
        ProductionPriority priority,
        ProductionScheduleStatus status
) {}