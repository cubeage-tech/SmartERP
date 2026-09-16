package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateWorkOrderRequest(
        @NotBlank(message = "Product title is required") String productName,
        @NotNull(message = "Quantity is required") @Min(value = 1, message = "Quantity must be at least 1") Integer quantity,
        String bomNumber,
        String machineName,
        String operatorName,
        LocalDate dueDate,
        WorkOrderStatus status,
        @Min(0) @Max(100) Integer progress
) {}