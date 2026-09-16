package com.cubeage.erp.manufacturing.dto.response;

import com.cubeage.erp.manufacturing.enums.WorkOrderStatus;

public record WorkOrderProgressResponse(
        Long id,
        String workOrderNumber,
        WorkOrderStatus status,
        Integer progress
) {}
