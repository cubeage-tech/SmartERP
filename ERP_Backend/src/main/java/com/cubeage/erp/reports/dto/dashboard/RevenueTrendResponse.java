package com.cubeage.erp.reports.dto.dashboard;

import java.math.BigDecimal;

public record RevenueTrendResponse(
    String name,
    BigDecimal value
) {}
