package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record WorkOrderResponse(
        Long id,
        String workOrderNumber,
        WorkOrderStatus status,
        String statusType,
        String title,
        Integer quantity,
        String bomNumber,
        String machineCode,
        String operatorName,
        LocalDate dueDate,
        Integer progress,
        List<List<String>> details,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}