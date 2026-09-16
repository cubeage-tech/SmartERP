package com.cubeage.erp.manufacturing.dto.response;

public record RejectionResponse(
        Long id,
        String product,
        String workOrderNumber,
        String reason,
        String quantity
) {}