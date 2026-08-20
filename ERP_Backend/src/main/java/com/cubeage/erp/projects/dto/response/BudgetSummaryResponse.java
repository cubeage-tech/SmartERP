package com.cubeage.erp.projects.dto.response; import java.math.BigDecimal; import java.util.Map;
public record BudgetSummaryResponse(Long projectId,BigDecimal plannedBudget,BigDecimal actualBudget,BigDecimal variance,
 BigDecimal utilizationPercent,boolean overBudgetThreshold,Map<String,BigDecimal> plannedByType,Map<String,BigDecimal> actualByType) {}
