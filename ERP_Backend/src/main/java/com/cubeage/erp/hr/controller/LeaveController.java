package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.leave.LeaveBalanceResponse;
import com.cubeage.erp.hr.dto.leave.LeaveRequestDto;
import com.cubeage.erp.hr.dto.leave.LeaveResponse;
import com.cubeage.erp.hr.entity.Employee;
import com.cubeage.erp.hr.service.LeaveService;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/hr/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    private Long resolveTenantId(Long tenantId) {
        if (tenantId != null) {
            return tenantId;
        }
        Long contextTenantId = TenantContext.getTenantId();
        if (contextTenantId != null) {
            return contextTenantId;
        }
        try {
            return SecurityUtils.currentTenantId();
        } catch (Exception e) {
            return 3L;
        }
    }

    private Long resolveScopedEmployeeId(Long tenantId, Long requestedEmployeeId) {
        try {
            boolean isStaffAdmin = SecurityUtils.hasRole("SUPER_ADMIN")
                    || SecurityUtils.hasRole("TENANT_ADMIN")
                    || SecurityUtils.hasRole("HR_MANAGER");

            if (isStaffAdmin) {
                return requestedEmployeeId;
            }
            // For standard employee, always enforce their own resolved employee ID
            return leaveService.findCurrentEmployee(tenantId)
                    .map(Employee::getId)
                    .orElse(requestedEmployeeId);
        } catch (Exception e) {
            return requestedEmployeeId;
        }
    }

    @GetMapping("/balance")
    public LeaveBalanceResponse getLeaveBalance(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Integer year
    ) {
        Long tid = resolveTenantId(tenantId);
        boolean isStaffAdmin = SecurityUtils.hasRole("SUPER_ADMIN")
                || SecurityUtils.hasRole("TENANT_ADMIN")
                || SecurityUtils.hasRole("HR_MANAGER");

        if (isStaffAdmin) {
            if (employeeId != null) {
                return leaveService.getLeaveBalance(tid, employeeId, year);
            }
            Optional<Employee> selfEmp = leaveService.findCurrentEmployee(tid);
            if (selfEmp.isPresent()) {
                return leaveService.getLeaveBalance(tid, selfEmp.get().getId(), year);
            }
            int targetYear = (year != null && year > 2000) ? year : LocalDate.now().getYear();
            return LeaveBalanceResponse.builder()
                    .totalLeaves(0.0)
                    .remainingLeaves(0.0)
                    .pendingLeaves(0.0)
                    .takenLeaves(0.0)
                    .leaveYear(targetYear)
                    .employeeId(null)
                    .employeeName("Staff Admin (No Employee Profile)")
                    .build();
        }

        Long eid = resolveScopedEmployeeId(tid, employeeId);
        return leaveService.getLeaveBalance(tid, eid, year);
    }

    @GetMapping
    public List<LeaveResponse> getLeaves(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year
    ) {
        Long tid = resolveTenantId(tenantId);
        Long eid = resolveScopedEmployeeId(tid, employeeId);
        return leaveService.getLeaves(tid, eid, status, year);
    }

    @GetMapping("/{id}")
    public LeaveResponse getLeave(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        return leaveService.getLeave(resolveTenantId(tenantId), id);
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> createLeave(
            @RequestParam(required = false) Long tenantId,
            @RequestBody LeaveRequestDto request
    ) {
        Long tid = resolveTenantId(tenantId);
        Long eid = resolveScopedEmployeeId(tid, request.getEmployeeId());
        LeaveResponse response = leaveService.createLeave(tid, eid, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') and !hasAnyRole('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public LeaveResponse updateLeave(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id,
            @RequestBody LeaveRequestDto request
    ) {
        Long tid = resolveTenantId(tenantId);
        Long eid = resolveScopedEmployeeId(tid, null);
        return leaveService.updateLeave(tid, id, eid, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE') and !hasAnyRole('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public LeaveResponse cancelLeave(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        Long tid = resolveTenantId(tenantId);
        Long eid = resolveScopedEmployeeId(tid, null);
        return leaveService.cancelLeave(tid, id, eid);
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('HR_MANAGER','TENANT_ADMIN','SUPER_ADMIN')")
    public LeaveResponse approveLeave(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        return leaveService.approveLeave(resolveTenantId(tenantId), id);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('HR_MANAGER','TENANT_ADMIN','SUPER_ADMIN')")
    public LeaveResponse rejectLeave(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        return leaveService.rejectLeave(resolveTenantId(tenantId), id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('HR_MANAGER','TENANT_ADMIN','SUPER_ADMIN')")
    public LeaveResponse updateStatus(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return leaveService.updateStatus(resolveTenantId(tenantId), id, status);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportLeaves(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Integer year
    ) {
        Long tid = resolveTenantId(tenantId);
        Long eid = resolveScopedEmployeeId(tid, employeeId);
        byte[] csv = leaveService.exportLeavesCsv(tid, eid, year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"leave-requests.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
