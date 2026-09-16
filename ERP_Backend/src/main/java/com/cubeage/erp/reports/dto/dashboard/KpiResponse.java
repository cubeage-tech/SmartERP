package com.cubeage.erp.reports.dto.dashboard;

public record KpiResponse(
    String label,
    String value,
    String change,
    String direction
) {}
