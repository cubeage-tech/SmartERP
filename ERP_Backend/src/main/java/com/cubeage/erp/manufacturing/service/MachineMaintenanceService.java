package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateMaintenanceRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineMaintenanceResponse;

import java.util.List;

public interface MachineMaintenanceService {

    MachineMaintenanceResponse create(Long tenantId, CreateMaintenanceRequest request);

    List<MachineMaintenanceResponse> getAll(Long tenantId);

    List<MachineMaintenanceResponse> getByMachine(Long tenantId, Long machineId);

    MachineMaintenanceResponse completeMaintenance(Long tenantId, Long id);
}