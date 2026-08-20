package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.*; import java.math.BigDecimal; import java.time.LocalDate;
public record UpdateProjectRequest(String name,String description,Long managerUserId,String managerName,
 Long branchId,Long departmentId,Long costCenterId,LocalDate startDate,LocalDate endDate,
 ProjectStatus status,ProjectPriority priority,BigDecimal plannedBudget,
 BigDecimal budgetAlertThresholdPercent,Integer progressPercent) {}
