package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.attendance.AttendanceRequest;
import com.cubeage.erp.hr.dto.attendance.AttendanceResponse;
import com.cubeage.erp.hr.service.AttendanceService;
import com.cubeage.erp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr/attendance")
@RequiredArgsConstructor
@PreAuthorize(
        "hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_MANAGER', 'HR') " +
                "or @permissionEvaluator.has(authentication, 'HR', 'VIEW')"
)
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public List<AttendanceResponse> getAttendance() {
        return attendanceService.getAttendanceRecords(
                SecurityUtils.currentTenantId()
        );
    }

    @PostMapping
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'HR_MANAGER', 'HR') " +
                    "or @permissionEvaluator.has(authentication, 'HR', 'CREATE')"
    )
    public ResponseEntity<AttendanceResponse> logAttendance(
            @RequestBody AttendanceRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attendanceService.logAttendance(
                        SecurityUtils.currentTenantId(),
                        request
                ));
    }
}