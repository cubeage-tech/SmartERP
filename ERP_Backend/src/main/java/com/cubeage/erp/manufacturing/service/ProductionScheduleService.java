package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateProductionScheduleRequest;
import com.cubeage.erp.manufacturing.dto.response.ProductionScheduleResponse;

import java.util.List;

public interface ProductionScheduleService {

    ProductionScheduleResponse create(Long tenantId, CreateProductionScheduleRequest request);

    List<ProductionScheduleResponse> getAll(Long tenantId);
}