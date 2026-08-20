package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.ProjectPriority; import jakarta.validation.constraints.*;
import java.math.BigDecimal; import java.time.LocalDate;
public record CreateProjectRequest(
 @NotBlank String projectCode,@NotBlank String name,String description,Long customerId,String customerName,
 @NotNull Long managerUserId,String managerName,Long branchId,Long departmentId,Long costCenterId,
 @NotNull LocalDate startDate,@NotNull LocalDate endDate,@NotNull ProjectPriority priority,
 @NotNull @DecimalMin("0.00") BigDecimal plannedBudget,BigDecimal budgetAlertThresholdPercent) {}
