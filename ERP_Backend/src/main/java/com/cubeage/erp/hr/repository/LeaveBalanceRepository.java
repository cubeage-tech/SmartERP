package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    List<LeaveBalance> findByTenantIdAndEmployeeIdAndYear(Long tenantId, Long employeeId, Integer year);

    Optional<LeaveBalance> findByTenantIdAndEmployeeIdAndLeaveTypeAndYear(
            Long tenantId, Long employeeId, String leaveType, Integer year
    );
}
