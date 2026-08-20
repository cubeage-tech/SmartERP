package com.cubeage.erp.projects.repository;
import com.cubeage.erp.projects.entity.Timesheet; import com.cubeage.erp.projects.enums.TimesheetStatus;
import org.springframework.data.jpa.repository.*; import java.math.BigDecimal; import java.util.*;
public interface TimesheetRepository extends JpaRepository<Timesheet,Long>{
 Optional<Timesheet> findByIdAndTenantId(Long id,Long tenantId);
 List<Timesheet> findByTenantIdAndUserIdOrderByWorkDateDesc(Long tenantId,Long userId);
 List<Timesheet> findByTenantIdAndProject_IdOrderByWorkDateDesc(Long tenantId,Long projectId);
 long countByTenantIdAndStatus(Long tenantId,TimesheetStatus status);
 @Query("select coalesce(sum(t.hours),0) from Timesheet t where t.tenantId=:tenantId and t.task.id=:taskId and t.status=:status")
 BigDecimal sumHoursByTaskAndStatus(Long tenantId,Long taskId,TimesheetStatus status);
}
