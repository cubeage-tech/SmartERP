package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<LeaveRequest> findByTenantIdAndStatusOrderByCreatedAtDesc(Long tenantId, String status);

    List<LeaveRequest> findByTenantIdAndEmployeeIdOrderByCreatedAtDesc(Long tenantId, Long employeeId);

    List<LeaveRequest> findByTenantIdAndEmployeeIdAndStatusOrderByCreatedAtDesc(Long tenantId, Long employeeId, String status);

    Optional<LeaveRequest> findByIdAndTenantId(Long id, Long tenantId);

    Optional<LeaveRequest> findByIdAndTenantIdAndEmployeeId(Long id, Long tenantId, Long employeeId);

    long countByTenantIdAndStatus(Long tenantId, String status);

    long countByTenantIdAndEmployeeIdAndStatus(Long tenantId, Long employeeId, String status);
}
