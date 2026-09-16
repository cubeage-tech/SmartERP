package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.WorkOrder;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Optional<WorkOrder> findByIdAndTenantId(Long id, Long tenantId);

    List<WorkOrder> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<WorkOrder> findByTenantIdAndStatusOrderByCreatedAtDesc(Long tenantId, WorkOrderStatus status);

    long countByTenantIdAndStatus(Long tenantId, WorkOrderStatus status);

    long countByTenantId(Long tenantId);
}