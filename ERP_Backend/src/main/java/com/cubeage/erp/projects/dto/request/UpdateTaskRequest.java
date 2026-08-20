package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.*; import java.math.BigDecimal; import java.time.LocalDate;
public record UpdateTaskRequest(String title,String description,Long assignedToUserId,String assignedToName,
 LocalDate plannedStartDate,LocalDate plannedEndDate,LocalDate actualStartDate,LocalDate actualEndDate,
 TaskStatus status,TaskPriority priority,Integer progressPercent,BigDecimal plannedHours) {}
