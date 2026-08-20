package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.CreateMilestoneRequest; import com.cubeage.erp.projects.dto.response.MilestoneResponse;
import java.util.List;
public interface MilestoneService {
 MilestoneResponse create(Long tenantId,Long projectId,CreateMilestoneRequest request);
 List<MilestoneResponse> list(Long tenantId,Long projectId);
 MilestoneResponse complete(Long tenantId,Long milestoneId);
}
