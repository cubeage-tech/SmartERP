package com.cubeage.erp.projects.dto.response;
import java.math.BigDecimal; import java.time.LocalDate; import java.util.List;
public record TaskResponse(Long id,Long projectId,Long milestoneId,Long parentTaskId,String title,String description,
 Long assignedToUserId,String assignedToName,LocalDate plannedStartDate,LocalDate plannedEndDate,
 LocalDate actualStartDate,LocalDate actualEndDate,String status,String priority,Integer progressPercent,
 BigDecimal plannedHours,BigDecimal actualHours,Boolean atRisk,String riskReason,List<Long> dependencyTaskIds) {}
