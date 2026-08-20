package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.BudgetCostType; import jakarta.validation.constraints.*;
import java.math.BigDecimal; import java.time.LocalDate;
public record CostEntryRequest(Long taskId,@NotNull BudgetCostType costType,@NotNull @DecimalMin("0.01") BigDecimal amount,
 @NotNull LocalDate costDate,String description,String referenceType,Long referenceId) {}
