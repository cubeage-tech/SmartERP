package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.manufacturing.dto.request.CreateMaintenanceRequest;
import com.cubeage.erp.manufacturing.dto.response.MachineMaintenanceResponse;
import com.cubeage.erp.manufacturing.entity.Machine;
import com.cubeage.erp.manufacturing.entity.MachineMaintenance;
import com.cubeage.erp.manufacturing.enums.MachineStatus;
import com.cubeage.erp.manufacturing.enums.MaintenanceStatus;
import com.cubeage.erp.manufacturing.mapper.MachineMaintenanceMapper;
import com.cubeage.erp.manufacturing.repository.MachineMaintenanceRepository;
import com.cubeage.erp.manufacturing.repository.MachineRepository;
import com.cubeage.erp.manufacturing.service.MachineMaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MachineMaintenanceServiceImpl implements MachineMaintenanceService {

    private final MachineMaintenanceRepository maintenanceRepository;
    private final MachineRepository machineRepository;
    private final MachineMaintenanceMapper mapper;

    @Override
    public MachineMaintenanceResponse create(Long tenantId, CreateMaintenanceRequest request) {
        Machine machine = machineRepository.findByIdAndTenantId(request.machineId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found: " + request.machineId()));

        machine.setStatus(MachineStatus.MAINTENANCE);
        machineRepository.save(machine);

        MachineMaintenance maintenance = MachineMaintenance.builder()
                .tenantId(tenantId)
                .machine(machine)
                .type(request.type())
                .status(MaintenanceStatus.SCHEDULED)
                .scheduledDate(request.scheduledDate())
                .notes(request.notes())
                .build();

        return mapper.toResponse(maintenanceRepository.save(maintenance));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MachineMaintenanceResponse> getAll(Long tenantId) {
        return maintenanceRepository.findByTenantIdOrderByScheduledDateDesc(tenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MachineMaintenanceResponse> getByMachine(Long tenantId, Long machineId) {
        return maintenanceRepository.findByMachineIdAndTenantIdOrderByScheduledDateDesc(machineId, tenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public MachineMaintenanceResponse completeMaintenance(Long tenantId, Long id) {
        MachineMaintenance maintenance = maintenanceRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found: " + id));

        maintenance.setStatus(MaintenanceStatus.COMPLETED);
        maintenance.setCompletedDate(LocalDate.now());

        Machine machine = maintenance.getMachine();
        machine.setStatus(MachineStatus.RUNNING);
        machine.setLastMaintenance(LocalDate.now());
        machineRepository.save(machine);

        return mapper.toResponse(maintenanceRepository.save(maintenance));
    }
}