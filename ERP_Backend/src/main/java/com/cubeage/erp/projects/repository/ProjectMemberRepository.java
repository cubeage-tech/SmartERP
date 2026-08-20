package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.ProjectMember; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ProjectMemberRepository extends JpaRepository<ProjectMember,Long>{
 List<ProjectMember> findByTenantIdAndProject_IdAndActiveTrue(Long tenantId,Long projectId);
 Optional<ProjectMember> findByTenantIdAndProject_IdAndUserId(Long tenantId,Long projectId,Long userId);
 List<ProjectMember> findByTenantIdAndUserIdAndActiveTrue(Long tenantId,Long userId);
}
