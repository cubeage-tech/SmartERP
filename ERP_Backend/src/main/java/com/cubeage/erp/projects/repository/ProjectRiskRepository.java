package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectRisk; import com.cubeage.erp.projects.enums.RiskStatus;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectRiskRepository extends JpaRepository<ProjectRisk,Long>{
 List<ProjectRisk> findByTenantIdAndProject_IdOrderByCreatedAtDesc(Long tenantId,Long projectId);
 Optional<ProjectRisk> findByIdAndTenantId(Long id,Long tenantId);
 long countByTenantIdAndStatusNot(Long tenantId,RiskStatus status);
}
