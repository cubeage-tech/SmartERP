package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectTask; import com.cubeage.erp.projects.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository; import java.time.LocalDate; import java.util.*;
public interface ProjectTaskRepository extends JpaRepository<ProjectTask,Long>{
 List<ProjectTask> findByTenantIdAndProject_IdOrderByPlannedStartDateAsc(Long tenantId,Long projectId);
 Optional<ProjectTask> findByIdAndTenantId(Long id,Long tenantId);
 long countByTenantIdAndPlannedEndDateBeforeAndStatusNot(Long tenantId,LocalDate date,TaskStatus status);
 long countByTenantIdAndAtRiskTrue(Long tenantId);
 List<ProjectTask> findByTenantIdAndAssignedToUserIdAndStatusNot(Long tenantId,Long userId,TaskStatus status);
}
