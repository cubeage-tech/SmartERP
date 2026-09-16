package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.MachineStatus;

import java.time.LocalDate;

public record MachineResponse(
        Long id,
        String code,
        String name,
        String floor,
        MachineStatus status,
        String statusType,
        Integer utilization,
        LocalDate lastMaintenance,
        LocalDate nextMaintenance
) {}