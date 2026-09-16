package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.MaintenanceStatus;
import com.cubeage.erp.manufacturing.enums.MaintenanceType;

import java.time.LocalDate;

public record MachineMaintenanceResponse(
        Long id,
        Long machineId,
        String machineCode,
        String machineName,
        MaintenanceType type,
        MaintenanceStatus status,
        LocalDate scheduledDate,
        LocalDate completedDate,
        String notes
) {}