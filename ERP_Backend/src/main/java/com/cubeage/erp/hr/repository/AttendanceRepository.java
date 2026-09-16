package com.cubeage.erp.hr.repository;

import com.cubeage.erp.hr.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByTenantIdOrderByAttendanceDateDesc(Long tenantId);

    List<Attendance> findByTenantIdAndEmployeeIdOrderByAttendanceDateDesc(Long tenantId, Long employeeId);

    List<Attendance> findByTenantIdAndAttendanceDate(Long tenantId, LocalDate attendanceDate);
}
