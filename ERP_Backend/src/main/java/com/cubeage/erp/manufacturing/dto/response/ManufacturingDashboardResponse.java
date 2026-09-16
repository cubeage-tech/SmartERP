package com.cubeage.erp.manufacturing.dto.response;

import java.util.List;

public record ManufacturingDashboardResponse(
        List<StatCardDto> stats
) {
    public record StatCardDto(
            String value,
            String label,
            String description,
            String type
    ) {}
}