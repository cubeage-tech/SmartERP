package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.Project; import com.cubeage.erp.projects.enums.ProjectStatus;
import org.springframework.data.jpa.repository.*; import java.math.BigDecimal; import java.util.*;
public interface ProjectRepository extends JpaRepository<Project,Long>,JpaSpecificationExecutor<Project>{
 Optional<Project> findByIdAndTenantId(Long id,Long tenantId);
 boolean existsByTenantIdAndProjectCodeIgnoreCase(Long tenantId,String projectCode);
 List<Project> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
 long countByTenantId(Long tenantId); long countByTenantIdAndStatus(Long tenantId,ProjectStatus status);
 @Query("select coalesce(sum(p.plannedBudget),0) from Project p where p.tenantId=:tenantId") BigDecimal totalPlannedBudget(Long tenantId);
 @Query("select coalesce(sum(p.actualBudget),0) from Project p where p.tenantId=:tenantId") BigDecimal totalActualBudget(Long tenantId);
}
