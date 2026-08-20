package com.cubeage.erp.projects.service;
import com.cubeage.erp.projects.dto.request.*; import com.cubeage.erp.projects.dto.response.TaskResponse; import java.util.List;
public interface TaskService {
 TaskResponse create(Long tenantId,Long projectId,CreateTaskRequest request);
 TaskResponse update(Long tenantId,Long taskId,UpdateTaskRequest request);
 TaskResponse get(Long tenantId,Long taskId);
 List<TaskResponse> list(Long tenantId,Long projectId);
 TaskResponse addDependency(Long tenantId,Long taskId,TaskDependencyRequest request);
 void evaluateDependencyRisk(Long tenantId,Long dependencyTaskId);
}
