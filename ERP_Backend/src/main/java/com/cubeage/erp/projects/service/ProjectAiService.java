package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.response.AiInsightResponse; import java.util.List;
public interface ProjectAiService {
 List<AiInsightResponse> analyze(Long tenantId,Long projectId);
 List<AiInsightResponse> insights(Long tenantId,Long projectId);
}
