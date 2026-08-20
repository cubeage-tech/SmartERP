package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectMilestone; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone,Long>{
 List<ProjectMilestone> findByTenantIdAndProject_IdOrderByPlannedDateAsc(Long tenantId,Long projectId);
 Optional<ProjectMilestone> findByIdAndTenantId(Long id,Long tenantId);
}
