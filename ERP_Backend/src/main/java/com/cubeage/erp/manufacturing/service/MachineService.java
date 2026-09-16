package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateMachineRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateMachineRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineResponse;

import java.util.List;

public interface MachineService {

    MachineResponse create(Long tenantId, CreateMachineRequest request);

    List<MachineResponse> getAll(Long tenantId);

    MachineResponse getById(Long tenantId, Long id);

    MachineResponse update(Long tenantId, Long id, UpdateMachineRequest request);

    void delete(Long tenantId, Long id);
}