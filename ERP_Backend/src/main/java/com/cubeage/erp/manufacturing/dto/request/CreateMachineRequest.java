package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.MachineStatus;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateMachineRequest(
        @NotBlank(message = "Machine code is required") String code,
        @NotBlank(message = "Machine name is required") String name,
        @NotBlank(message = "Shop floor is required") String shopFloor,
        @NotNull MachineStatus status,
        @Min(0) @Max(100) Integer utilization,
        LocalDate lastMaintenance,
        LocalDate nextMaintenance
) {}