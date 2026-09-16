package com.cubeage.erp.manufacturing.dto.request;

import com.cubeage.erp.manufacturing.enums.MachineStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateMachineStatusRequest(
        @NotNull(message = "Machine status is required") MachineStatus status
) {}
