package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectAiInsight; import com.cubeage.erp.projects.enums.AiInsightType;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectAiInsightRepository extends JpaRepository<ProjectAiInsight,Long>{
 List<ProjectAiInsight> findByTenantIdAndProject_IdAndActiveTrueOrderByCreatedAtDesc(Long tenantId,Long projectId);
 List<ProjectAiInsight> findByTenantIdAndProject_IdAndTypeAndActiveTrue(Long tenantId,Long projectId,AiInsightType type);
}
