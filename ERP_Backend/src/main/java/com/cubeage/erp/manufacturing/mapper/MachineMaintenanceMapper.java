package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.MachineMaintenanceResponse;
import com.cubeage.erp.manufacturing.entity.MachineMaintenance;
import org.springframework.stereotype.Component;

@Component
public class MachineMaintenanceMapper {

    public MachineMaintenanceResponse toResponse(MachineMaintenance maintenance) {
        return new MachineMaintenanceResponse(
                maintenance.getId(),
                maintenance.getMachine().getId(),
                maintenance.getMachine().getCode(),
                maintenance.getMachine().getName(),
                maintenance.getType(),
                maintenance.getStatus(),
                maintenance.getScheduledDate(),
                maintenance.getCompletedDate(),
                maintenance.getNotes()
        );
    }
}