package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.ProductionScheduleResponse;
import com.cubeage.erp.manufacturing.entity.ProductionSchedule;
import org.springframework.stereotype.Component;

@Component
public class ProductionScheduleMapper {

    public ProductionScheduleResponse toResponse(ProductionSchedule schedule) {
        return new ProductionScheduleResponse(
                schedule.getId(),
                schedule.getWorkOrder().getId(),
                schedule.getWorkOrder().getWorkOrderNumber(),
                schedule.getWorkOrder().getTitle(),
                schedule.getStartDate(),
                schedule.getEndDate(),
                schedule.getPriority(),
                schedule.getStatus()
        );
    }
}