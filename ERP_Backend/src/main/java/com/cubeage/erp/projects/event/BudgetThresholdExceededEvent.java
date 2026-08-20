package com.cubeage.erp.projects.event;
import java.math.BigDecimal;
public record BudgetThresholdExceededEvent(Long tenantId, Long projectId, BigDecimal planned, BigDecimal actual, BigDecimal utilizationPercent) {}
