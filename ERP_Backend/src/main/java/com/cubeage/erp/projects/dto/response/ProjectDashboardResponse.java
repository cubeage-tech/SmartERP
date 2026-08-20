package com.cubeage.erp.projects.dto.response; import java.math.BigDecimal;
public record ProjectDashboardResponse(long totalProjects,long activeProjects,long completedProjects,long atRiskProjects,
 long overdueTasks,long pendingTimesheets,BigDecimal totalPlannedBudget,BigDecimal totalActualBudget,BigDecimal budgetUtilizationPercent) {}
