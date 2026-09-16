package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.request.UpdateWorkOrderRequest;
import com.cubeage.erp.manufacturing.dto.response.WorkOrderResponse;
import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;

import java.util.List;

public interface WorkOrderService {

    WorkOrderResponse create(Long tenantId, CreateWorkOrderRequest request);

    List<WorkOrderResponse> getAll(Long tenantId);

    List<WorkOrderResponse> getByStatus(Long tenantId, WorkOrderStatus status);

    WorkOrderResponse getById(Long tenantId, Long id);

    WorkOrderResponse update(Long tenantId, Long id, UpdateWorkOrderRequest request);

    void delete(Long tenantId, Long id);
}