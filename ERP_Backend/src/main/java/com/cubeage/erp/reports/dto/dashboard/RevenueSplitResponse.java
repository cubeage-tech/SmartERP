package com.cubeage.erp.reports.dto.dashboard;

import java.math.BigDecimal;

public record RevenueSplitResponse(
    String name,
    BigDecimal value
) {}
