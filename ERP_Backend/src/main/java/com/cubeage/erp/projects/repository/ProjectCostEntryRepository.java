package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectCostEntry; import org.springframework.data.jpa.repository.*; import java.math.BigDecimal; import java.util.*;
public interface ProjectCostEntryRepository extends JpaRepository<ProjectCostEntry,Long>{
 List<ProjectCostEntry> findByTenantIdAndProject_IdOrderByCostDateDesc(Long tenantId,Long projectId);
 @Query("select coalesce(sum(c.amount),0) from ProjectCostEntry c where c.tenantId=:tenantId and c.project.id=:projectId")
 BigDecimal totalActualCost(Long tenantId,Long projectId);
}
