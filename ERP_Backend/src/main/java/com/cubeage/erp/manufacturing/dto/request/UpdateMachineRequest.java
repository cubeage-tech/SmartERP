package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.MachineStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public record UpdateMachineRequest(
        String name,
        String shopFloor,
        MachineStatus status,
        @Min(0) @Max(100) Integer utilization,
        LocalDate lastMaintenance,
        LocalDate nextMaintenance
) {}