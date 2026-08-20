package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectBudget; import com.cubeage.erp.projects.enums.BudgetCostType;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectBudgetRepository extends JpaRepository<ProjectBudget,Long>{
 List<ProjectBudget> findByTenantIdAndProject_Id(Long tenantId,Long projectId);
 Optional<ProjectBudget> findByTenantIdAndProject_IdAndCostType(Long tenantId,Long projectId,BudgetCostType costType);
}
