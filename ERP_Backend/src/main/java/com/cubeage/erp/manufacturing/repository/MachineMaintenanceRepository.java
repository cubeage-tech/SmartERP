package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.MachineMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineMaintenanceRepository extends JpaRepository<MachineMaintenance, Long> {

    Optional<MachineMaintenance> findByIdAndTenantId(Long id, Long tenantId);

    List<MachineMaintenance> findByMachineIdAndTenantIdOrderByScheduledDateDesc(Long machineId, Long tenantId);

    List<MachineMaintenance> findByTenantIdOrderByScheduledDateDesc(Long tenantId);
}