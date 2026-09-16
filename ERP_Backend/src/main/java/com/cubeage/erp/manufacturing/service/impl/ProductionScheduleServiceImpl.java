package com.cubeage.erp.manufacturing.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.manufacturing.dto.request.CreateProductionScheduleRequest;
import com.cubeage.erp.manufacturing.dto.response.ProductionScheduleResponse;
import com.cubeage.erp.manufacturing.entity.ProductionSchedule;
import com.cubeage.erp.manufacturing.entity.WorkOrder;
import com.cubeage.erp.manufacturing.enums.ProductionScheduleStatus;
import com.cubeage.erp.manufacturing.mapper.ProductionScheduleMapper;
import com.cubeage.erp.manufacturing.repository.ProductionScheduleRepository;
import com.cubeage.erp.manufacturing.repository.WorkOrderRepository;
import com.cubeage.erp.manufacturing.service.ProductionScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductionScheduleServiceImpl implements ProductionScheduleService {

    private final ProductionScheduleRepository scheduleRepository;
    private final WorkOrderRepository workOrderRepository;
    private final ProductionScheduleMapper mapper;

    @Override
    public ProductionScheduleResponse create(Long tenantId, CreateProductionScheduleRequest request) {
        WorkOrder workOrder = workOrderRepository.findByIdAndTenantId(request.workOrderId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found: " + request.workOrderId()));

        ProductionSchedule schedule = ProductionSchedule.builder()
                .tenantId(tenantId)
                .workOrder(workOrder)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .priority(request.priority())
                .status(ProductionScheduleStatus.PLANNED)
                .build();

        return mapper.toResponse(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductionScheduleResponse> getAll(Long tenantId) {
        return scheduleRepository.findByTenantIdOrderByStartDateAsc(tenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}