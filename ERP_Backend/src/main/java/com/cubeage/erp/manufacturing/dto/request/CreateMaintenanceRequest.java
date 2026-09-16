package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.MaintenanceType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateMaintenanceRequest(
        @NotNull(message = "Machine ID is required") Long machineId,
        @NotNull(message = "Maintenance type is required") MaintenanceType type,
        @NotNull(message = "Scheduled date is required") LocalDate scheduledDate,
        String notes
) {}