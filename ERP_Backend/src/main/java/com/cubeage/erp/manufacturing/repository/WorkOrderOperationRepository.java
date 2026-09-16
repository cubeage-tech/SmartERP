package com.cubeage.erp.manufacturing.repository;

import com.cubeage.erp.manufacturing.entity.WorkOrderOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderOperationRepository extends JpaRepository<WorkOrderOperation, Long> {

    List<WorkOrderOperation> findByWorkOrderIdAndTenantIdOrderBySequenceOrderAsc(Long workOrderId, Long tenantId);
}