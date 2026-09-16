package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.manufacturing.dto.request.CreateMachineRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateMachineRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineResponse;
import com.cubeage.erp.manufacturing.entity.Machine;
import com.cubeage.erp.manufacturing.mapper.MachineMapper;
import com.cubeage.erp.manufacturing.repository.MachineRepository;
import com.cubeage.erp.manufacturing.service.MachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;
    private final MachineMapper mapper;

    @Override
    public MachineResponse create(Long tenantId, CreateMachineRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Machine machine = Machine.builder()
                .tenantId(effectiveTenantId)
                .code(request.code().trim().toUpperCase())
                .name(request.name().trim())
                .shopFloor(request.shopFloor().trim())
                .status(request.status())
                .utilization(request.utilization() == null ? 0 : request.utilization())
                .lastMaintenance(request.lastMaintenance())
                .nextMaintenance(request.nextMaintenance())
                .build();

        return mapper.toResponse(machineRepository.save(machine));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MachineResponse> getAll(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return machineRepository.findByTenantIdOrderByCodeAsc(effectiveTenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MachineResponse getById(Long tenantId, Long id) {
        return mapper.toResponse(getEntity(tenantId, id));
    }

    @Override
    public MachineResponse update(Long tenantId, Long id, UpdateMachineRequest request) {
        Machine machine = getEntity(tenantId, id);

        if (request.name() != null && !request.name().isBlank()) machine.setName(request.name().trim());
        if (request.shopFloor() != null && !request.shopFloor().isBlank()) machine.setShopFloor(request.shopFloor().trim());
        if (request.status() != null) machine.setStatus(request.status());
        if (request.utilization() != null) machine.setUtilization(request.utilization());
        if (request.lastMaintenance() != null) machine.setLastMaintenance(request.lastMaintenance());
        if (request.nextMaintenance() != null) machine.setNextMaintenance(request.nextMaintenance());

        return mapper.toResponse(machineRepository.save(machine));
    }

    @Override
    public void delete(Long tenantId, Long id) {
        Machine machine = getEntity(tenantId, id);
        machineRepository.delete(machine);
    }

    private Machine getEntity(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return machineRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> machineRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found: " + id));
    }
}