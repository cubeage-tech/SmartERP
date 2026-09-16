package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.MachineResponse;
import com.cubeage.erp.manufacturing.entity.Machine;
import org.springframework.stereotype.Component;

@Component
public class MachineMapper {

    public MachineResponse toResponse(Machine machine) {
        String statusType = switch (machine.getStatus()) {
            case RUNNING -> "running";
            case MAINTENANCE, DOWN -> "maintenance";
            case IDLE, OFF -> "idle";
        };

        return new MachineResponse(
                machine.getId(),
                machine.getCode(),
                machine.getName(),
                machine.getShopFloor(),
                machine.getStatus(),
                statusType,
                machine.getUtilization(),
                machine.getLastMaintenance(),
                machine.getNextMaintenance()
        );
    }
}