package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.RiskRequest; import com.cubeage.erp.projects.dto.response.RiskResponse; import java.util.List;
public interface RiskService {
 RiskResponse create(Long tenantId,Long projectId,RiskRequest request);
 List<RiskResponse> list(Long tenantId,Long projectId);
 RiskResponse resolve(Long tenantId,Long riskId);
}
