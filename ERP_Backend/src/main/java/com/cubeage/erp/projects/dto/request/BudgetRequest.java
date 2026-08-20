package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.BudgetCostType; import jakarta.validation.constraints.*; import java.math.BigDecimal;
public record BudgetRequest(@NotNull BudgetCostType costType,@NotNull @DecimalMin("0.00") BigDecimal plannedAmount) {}
