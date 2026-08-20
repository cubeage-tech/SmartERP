package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.*; import com.cubeage.erp.projects.dto.response.*; import java.util.List;
public interface ProjectService {
 ProjectResponse create(Long tenantId,CreateProjectRequest request);
 ProjectResponse update(Long tenantId,Long id,UpdateProjectRequest request);
 ProjectResponse get(Long tenantId,Long id);
 List<ProjectResponse> all(Long tenantId);
 List<ProjectResponse> search(Long tenantId,ProjectSearchRequest request);
 GanttResponse gantt(Long tenantId,Long projectId);
 ProjectMemberResponse addMember(Long tenantId,Long projectId,ProjectMemberRequest request);
 List<ProjectMemberResponse> members(Long tenantId,Long projectId);
 DocumentLinkResponse linkDocument(Long tenantId,Long projectId,DocumentLinkRequest request);
 List<DocumentLinkResponse> documents(Long tenantId,Long projectId);
}
