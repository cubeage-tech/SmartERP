package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.*; import com.cubeage.erp.projects.dto.response.BudgetSummaryResponse;
public interface BudgetService {
 BudgetSummaryResponse setPlanned(Long tenantId,Long projectId,BudgetRequest request);
 BudgetSummaryResponse addCost(Long tenantId,Long projectId,CostEntryRequest request);
 BudgetSummaryResponse summary(Long tenantId,Long projectId);
}
