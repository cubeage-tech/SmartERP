package com.cubeage.erp.hr.service;

import com.cubeage.erp.hr.dto.leave.LeaveBalanceResponse;
import com.cubeage.erp.hr.dto.leave.LeaveRequestDto;
import com.cubeage.erp.hr.dto.leave.LeaveResponse;
import com.cubeage.erp.hr.entity.Employee;
import com.cubeage.erp.hr.entity.LeaveBalance;
import com.cubeage.erp.hr.entity.LeaveRequest;
import com.cubeage.erp.hr.repository.EmployeeRepository;
import com.cubeage.erp.hr.repository.LeaveBalanceRepository;
import com.cubeage.erp.hr.repository.LeaveRequestRepository;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.security.user.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final LeaveBalanceRepository balanceRepository;
    private final EmployeeRepository employeeRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    public LeaveService(LeaveRequestRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
        this.balanceRepository = null;
        this.employeeRepository = null;
    }

    @Autowired
    public LeaveService(LeaveRequestRepository leaveRepository,
                        LeaveBalanceRepository balanceRepository,
                        EmployeeRepository employeeRepository) {
        this.leaveRepository = leaveRepository;
        this.balanceRepository = balanceRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Finds the employee profile corresponding to the currently authenticated user without mutating the database.
     */
    public Optional<Employee> findCurrentEmployee(Long tenantId) {
        if (employeeRepository == null) {
            return Optional.empty();
        }
        try {
            UserPrincipal user = SecurityUtils.currentUser();
            if (user == null) {
                return Optional.empty();
            }
            return employeeRepository.findByTenantIdAndUserId(tenantId, user.getId())
                    .or(() -> employeeRepository.findByTenantIdAndEmail(tenantId, user.getUsername()));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Resolves the target employee strictly read-only without modifying database.
     */
    public Employee resolveEmployee(Long tenantId, Long employeeId) {
        if (employeeRepository == null) {
            return Employee.builder()
                    .id(employeeId != null ? employeeId : 101L)
                    .firstName("Test")
                    .lastName("Employee")
                    .department("General")
                    .build();
        }
        if (employeeId != null) {
            return employeeRepository.findByIdAndTenantId(employeeId, tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));
        }

        return findCurrentEmployee(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("No employee profile found for current user in tenant " + tenantId));
    }

    private Employee createDefaultEmployee(Long tenantId, Long userId, String first, String last, String email) {
        long count = employeeRepository.count() + 1000;
        Employee emp = Employee.builder()
                .tenantId(tenantId)
                .userId(userId)
                .employeeCode(String.format("EMP-%04d", count))
                .firstName(first != null && !first.isBlank() ? first : "Employee")
                .lastName(last != null && !last.isBlank() ? last : "User")
                .email(email != null && !email.isBlank() ? email : "employee@smarterp.ai")
                .department("Engineering")
                .designation("Specialist")
                .branch("Headquarters")
                .joiningDate(LocalDate.of(2024, 1, 15))
                .status("ACTIVE")
                .build();
        return employeeRepository.save(emp);
    }

    /**
     * Normalizes frontend leave type strings to database check-constraint enum values.
     */
    public static String normalizeLeaveType(String input) {
        if (input == null || input.isBlank()) {
            return "CASUAL_LEAVE";
        }
        String s = input.trim().toUpperCase().replace(' ', '_');
        if (s.contains("SICK")) return "SICK_LEAVE";
        if (s.contains("EARNED") || s.contains("PRIVILEGE") || s.contains("ANNUAL")) return "EARNED_LEAVE";
        if (s.contains("MATERNITY")) return "MATERNITY_LEAVE";
        if (s.contains("PATERNITY")) return "PATERNITY_LEAVE";
        if (s.contains("UNPAID")) return "UNPAID_LEAVE";
        return "CASUAL_LEAVE";
    }

    public static String formatLeaveType(String raw) {
        if (raw == null) return "Casual Leave";
        return switch (raw.toUpperCase()) {
            case "CASUAL_LEAVE" -> "Casual Leave";
            case "SICK_LEAVE" -> "Sick Leave";
            case "EARNED_LEAVE" -> "Earned Leave";
            case "MATERNITY_LEAVE" -> "Maternity Leave";
            case "PATERNITY_LEAVE" -> "Paternity Leave";
            case "UNPAID_LEAVE" -> "Unpaid Leave";
            default -> raw.replace('_', ' ');
        };
    }

    @Transactional(readOnly = true)
    public LeaveBalanceResponse getLeaveBalance(Long tenantId, Long employeeId, Integer year) {
        int targetYear = (year != null && year > 2000) ? year : LocalDate.now().getYear();

        Employee emp = null;
        if (employeeId != null) {
            if (employeeRepository != null) {
                emp = employeeRepository.findByIdAndTenantId(employeeId, tenantId).orElse(null);
            }
            if (emp == null) {
                return LeaveBalanceResponse.builder()
                        .totalLeaves(0.0)
                        .remainingLeaves(0.0)
                        .pendingLeaves(0.0)
                        .takenLeaves(0.0)
                        .leaveYear(targetYear)
                        .employeeId(employeeId)
                        .employeeName("Unknown Employee")
                        .build();
            }
        } else {
            emp = findCurrentEmployee(tenantId).orElse(null);
            if (emp == null) {
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
        }

        List<LeaveBalance> balances = balanceRepository != null
                ? balanceRepository.findByTenantIdAndEmployeeIdAndYear(tenantId, emp.getId(), targetYear)
                : Collections.emptyList();
        double totalLeaves;

        if (balances.isEmpty()) {
            // Default annual allocation: 18 days (12 Casual + 6 Sick)
            totalLeaves = 18.0;
        } else {
            totalLeaves = balances.stream().mapToDouble(LeaveBalance::getTotalDays).sum();
        }

        // Calculate taken (APPROVED) and pending (PENDING) from actual persisted requests in this year
        List<LeaveRequest> requests = leaveRepository.findByTenantIdAndEmployeeIdOrderByCreatedAtDesc(tenantId, emp.getId());
        double takenLeaves = 0.0;
        double pendingLeaves = 0.0;

        for (LeaveRequest req : requests) {
            LocalDate d = req.getStartDate() != null ? req.getStartDate() : LocalDate.now();
            if (d.getYear() == targetYear) {
                double days = parseDays(req.getDays());
                if ("APPROVED".equalsIgnoreCase(req.getStatus())) {
                    takenLeaves += days;
                } else if ("PENDING".equalsIgnoreCase(req.getStatus())) {
                    pendingLeaves += days;
                }
            }
        }

        double remainingLeaves = Math.max(0.0, totalLeaves - takenLeaves - pendingLeaves);

        return LeaveBalanceResponse.builder()
                .totalLeaves(totalLeaves)
                .remainingLeaves(remainingLeaves)
                .pendingLeaves(pendingLeaves)
                .takenLeaves(takenLeaves)
                .leaveYear(targetYear)
                .employeeId(emp.getId())
                .employeeName(emp.getFirstName() + " " + (emp.getLastName() != null ? emp.getLastName() : ""))
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeaves(Long tenantId, Long employeeId, String status, Integer year) {
        List<LeaveRequest> list;

        if (employeeId != null) {
            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                list = leaveRepository.findByTenantIdAndEmployeeIdAndStatusOrderByCreatedAtDesc(tenantId, employeeId, status.toUpperCase());
            } else {
                list = leaveRepository.findByTenantIdAndEmployeeIdOrderByCreatedAtDesc(tenantId, employeeId);
            }
        } else {
            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                list = leaveRepository.findByTenantIdAndStatusOrderByCreatedAtDesc(tenantId, status.toUpperCase());
            } else {
                list = leaveRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
            }
        }

        if (year != null && year > 2000) {
            list = list.stream().filter(r -> {
                LocalDate d = r.getStartDate() != null ? r.getStartDate() : LocalDate.now();
                return d.getYear() == year;
            }).toList();
        }

        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public LeaveResponse getLeave(Long tenantId, Long id) {
        LeaveRequest leave = leaveRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));
        return toResponse(leave);
    }

    public LeaveResponse createLeave(Long tenantId, LeaveRequestDto request) {
        return createLeave(tenantId, request.getEmployeeId(), request);
    }

    public LeaveResponse createLeave(Long tenantId, Long employeeId, LeaveRequestDto request) {
        Long targetEmployeeId = employeeId != null ? employeeId : request.getEmployeeId();
        Employee emp;
        if (employeeRepository == null) {
            emp = Employee.builder()
                    .id(targetEmployeeId != null ? targetEmployeeId : 101L)
                    .firstName("Test")
                    .lastName("Employee")
                    .department("General")
                    .build();
        } else if (targetEmployeeId != null) {
            emp = employeeRepository.findByIdAndTenantId(targetEmployeeId, tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + targetEmployeeId));
        } else {
            emp = findCurrentEmployee(tenantId)
                    .orElseGet(() -> {
                        UserPrincipal user = null;
                        try {
                            user = SecurityUtils.currentUser();
                        } catch (Exception ignored) {}
                        String[] parts = (user != null && user.getName() != null) ? user.getName().split(" ", 2) : new String[]{"Employee", "User"};
                        String first = parts[0];
                        String last = parts.length > 1 ? parts[1] : "";
                        Long uid = user != null ? user.getId() : 1L;
                        String email = (user != null && user.getUsername() != null) ? user.getUsername() : "employee@smarterp.ai";
                        return createDefaultEmployee(tenantId, uid, first, last, email);
                    });
        }

        if (request.getStartDate() == null) {
            throw new IllegalArgumentException("From date is required");
        }
        if (request.getEndDate() == null) {
            throw new IllegalArgumentException("To date is required");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("To date cannot be before from date");
        }
        if (request.getReason() == null || request.getReason().trim().isBlank()) {
            throw new IllegalArgumentException("Reason is required");
        }

        long diffDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (diffDays <= 0) {
            throw new IllegalArgumentException("Number of days must be at least 1");
        }

        // Validate leave balance availability
        LeaveBalanceResponse balance = getLeaveBalance(tenantId, emp.getId(), request.getStartDate().getYear());
        if (diffDays > balance.getRemainingLeaves()) {
            throw new IllegalArgumentException(String.format(
                    "Requested days (%d) exceed available remaining leave balance (%.0f days).",
                    diffDays, balance.getRemainingLeaves()
            ));
        }

        String normalizedType = normalizeLeaveType(request.getLeaveType());

        long count = leaveRepository.count() + 1;
        String code = String.format("LV-%d-%04d", LocalDate.now().getYear(), count);

        String daysDisplay = request.getDays() != null && !request.getDays().isBlank()
                ? request.getDays()
                : (diffDays + (diffDays == 1 ? " Day" : " Days"));

        LeaveRequest entity = LeaveRequest.builder()
                .tenantId(tenantId)
                .leaveCode(code)
                .employeeId(emp.getId())
                .employeeName(emp.getFirstName() + " " + (emp.getLastName() != null ? emp.getLastName() : ""))
                .department(emp.getDepartment() != null ? emp.getDepartment() : "General")
                .leaveType(normalizedType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .formattedFrom(request.getStartDate().format(FORMATTER))
                .formattedTo(request.getEndDate().format(FORMATTER))
                .days(daysDisplay)
                .reason(request.getReason().trim())
                .contactDuringLeave(request.getContactDuringLeave())
                .attachmentUrl(request.getAttachmentUrl())
                .appliedOn(request.getAppliedOn() != null ? request.getAppliedOn() : LocalDate.now())
                .status("PENDING")
                .build();

        return toResponse(leaveRepository.save(entity));
    }

    public LeaveResponse updateLeave(Long tenantId, Long id, Long employeeId, LeaveRequestDto request) {
        if (SecurityUtils.hasRole("SUPER_ADMIN")
                || SecurityUtils.hasRole("TENANT_ADMIN")
                || SecurityUtils.hasRole("HR_MANAGER")) {
            throw new AccessDeniedException("Approvers cannot edit employee leave requests");
        }

        LeaveRequest leave = leaveRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));

        if (employeeId == null || !leave.getEmployeeId().equals(employeeId)) {
            throw new AccessDeniedException("You can only edit your own leave requests");
        }

        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new IllegalArgumentException("Only pending leave requests can be edited. Current status: " + leave.getStatus());
        }

        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new IllegalArgumentException("To date cannot be before from date");
            }
            long diffDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
            leave.setStartDate(request.getStartDate());
            leave.setEndDate(request.getEndDate());
            leave.setFormattedFrom(request.getStartDate().format(FORMATTER));
            String daysDisplay = request.getDays() != null && !request.getDays().isBlank()
                    ? request.getDays()
                    : (diffDays + (diffDays == 1 ? " Day" : " Days"));
            leave.setDays(daysDisplay);
        }

        if (request.getLeaveType() != null && !request.getLeaveType().isBlank()) {
            leave.setLeaveType(normalizeLeaveType(request.getLeaveType()));
        }
        if (request.getReason() != null && !request.getReason().isBlank()) {
            leave.setReason(request.getReason().trim());
        }
        if (request.getContactDuringLeave() != null) {
            leave.setContactDuringLeave(request.getContactDuringLeave());
        }
        if (request.getAttachmentUrl() != null) {
            leave.setAttachmentUrl(request.getAttachmentUrl());
        }

        return toResponse(leaveRepository.save(leave));
    }

    public LeaveResponse cancelLeave(Long tenantId, Long id, Long employeeId) {
        if (SecurityUtils.hasRole("SUPER_ADMIN")
                || SecurityUtils.hasRole("TENANT_ADMIN")
                || SecurityUtils.hasRole("HR_MANAGER")) {
            throw new AccessDeniedException("Approvers cannot cancel employee leave requests");
        }

        LeaveRequest leave = leaveRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));

        if (employeeId == null || !leave.getEmployeeId().equals(employeeId)) {
            throw new AccessDeniedException("You can only cancel your own leave requests");
        }

        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new IllegalArgumentException("Only pending leave requests can be cancelled. Current status: " + leave.getStatus());
        }

        leave.setStatus("CANCELLED");
        return toResponse(leaveRepository.save(leave));
    }

    public LeaveResponse updateStatus(Long tenantId, Long id, String status) {
        LeaveRequest leave = leaveRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + id));

        String s = status.trim().toUpperCase();
        if (!List.of("PENDING", "APPROVED", "REJECTED", "CANCELLED").contains(s)) {
            throw new IllegalArgumentException("Invalid leave status: " + status);
        }

        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new IllegalStateException("Only PENDING leave requests can be approved or rejected. Current status: " + leave.getStatus());
        }

        leave.setStatus(s);
        return toResponse(leaveRepository.save(leave));
    }

    public LeaveResponse approveLeave(Long tenantId, Long id) {
        return updateStatus(tenantId, id, "APPROVED");
    }

    public LeaveResponse rejectLeave(Long tenantId, Long id) {
        return updateStatus(tenantId, id, "REJECTED");
    }

    public byte[] exportLeavesCsv(Long tenantId, Long employeeId, Integer year) {
        List<LeaveResponse> list = getLeaves(tenantId, employeeId, null, year);
        StringBuilder sb = new StringBuilder();
        sb.append("Leave Code,Employee,Department,Leave Type,From Date,To Date,Days,Reason,Status,Applied On\n");

        for (LeaveResponse r : list) {
            sb.append(escapeCsv(r.getLeaveCode())).append(",")
                    .append(escapeCsv(r.getEmployeeName())).append(",")
                    .append(escapeCsv(r.getDepartment())).append(",")
                    .append(escapeCsv(r.getLeaveType())).append(",")
                    .append(escapeCsv(r.getFrom())).append(",")
                    .append(escapeCsv(r.getTo())).append(",")
                    .append(escapeCsv(r.getDays())).append(",")
                    .append(escapeCsv(r.getReason())).append(",")
                    .append(escapeCsv(r.getStatus())).append(",")
                    .append(escapeCsv(r.getAppliedOn() != null ? r.getAppliedOn().toString() : "")).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private double parseDays(String daysStr) {
        if (daysStr == null || daysStr.isBlank()) return 1.0;
        try {
            String cleaned = daysStr.replaceAll("[^0-9.]", "");
            return Double.parseDouble(cleaned);
        } catch (Exception e) {
            return 1.0;
        }
    }

    private LeaveResponse toResponse(LeaveRequest item) {
        double d = parseDays(item.getDays());
        String displayType = formatLeaveType(item.getLeaveType());

        return LeaveResponse.builder()
                .id(item.getId())
                .tenantId(item.getTenantId())
                .leaveCode(item.getLeaveCode())
                .employeeId(item.getEmployeeId())
                .employee(item.getEmployeeName())
                .employeeName(item.getEmployeeName())
                .dept(item.getDepartment())
                .department(item.getDepartment())
                .type(displayType)
                .leaveType(displayType)
                .startDate(item.getStartDate())
                .endDate(item.getEndDate())
                .from(item.getFormattedFrom())
                .to(item.getFormattedTo())
                .days(item.getDays())
                .numberOfDays(d)
                .reason(item.getReason())
                .status(item.getStatus())
                .contactDuringLeave(item.getContactDuringLeave())
                .attachmentUrl(item.getAttachmentUrl())
                .appliedOn(item.getAppliedOn() != null ? item.getAppliedOn()
                        : (item.getCreatedAt() != null ? LocalDate.ofInstant(item.getCreatedAt(), java.time.ZoneId.systemDefault()) : LocalDate.now()))
                .build();
    }
}
