package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.Machine;
import com.cubeage.erp.manufacturing.enums.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    Optional<Machine> findByIdAndTenantId(Long id, Long tenantId);

    Optional<Machine> findByCodeAndTenantId(String code, Long tenantId);

    List<Machine> findByTenantIdOrderByCodeAsc(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, MachineStatus status);
}