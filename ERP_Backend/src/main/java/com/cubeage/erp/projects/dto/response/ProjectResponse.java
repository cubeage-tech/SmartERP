package com.cubeage.erp.projects.dto.response;
import java.math.BigDecimal; import java.time.*;
public record ProjectResponse(Long id,String projectCode,String name,String description,Long customerId,String customerName,
 Long managerUserId,String managerName,Long branchId,Long departmentId,Long costCenterId,LocalDate startDate,LocalDate endDate,
 String status,String priority,BigDecimal plannedBudget,BigDecimal actualBudget,BigDecimal budgetAlertThresholdPercent,
 Integer progressPercent,LocalDateTime createdAt) {}
