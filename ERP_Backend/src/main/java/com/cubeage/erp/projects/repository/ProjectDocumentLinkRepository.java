package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectDocumentLink; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectDocumentLinkRepository extends JpaRepository<ProjectDocumentLink,Long>{
 List<ProjectDocumentLink> findByTenantIdAndProject_IdOrderByCreatedAtDesc(Long tenantId,Long projectId);
}
