package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.TaskDependency; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface TaskDependencyRepository extends JpaRepository<TaskDependency,Long>{
 List<TaskDependency> findByTenantIdAndTask_Id(Long tenantId,Long taskId);
 List<TaskDependency> findByTenantIdAndDependsOnTask_Id(Long tenantId,Long dependencyTaskId);
 boolean existsByTenantIdAndTask_IdAndDependsOnTask_Id(Long tenantId,Long taskId,Long dependsOnTaskId);
}
