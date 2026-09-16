package com.cubeage.erp.hr.service;

import com.cubeage.erp.hr.dto.dashboard.HRDashboardResponse;
import com.cubeage.erp.hr.entity.Attendance;
import com.cubeage.erp.hr.entity.Employee;
import com.cubeage.erp.hr.entity.LeaveRequest;
import com.cubeage.erp.hr.entity.Payroll;
import com.cubeage.erp.hr.repository.AttendanceRepository;
import com.cubeage.erp.hr.repository.EmployeeRepository;
import com.cubeage.erp.hr.repository.LeaveRequestRepository;
import com.cubeage.erp.hr.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HRDashboardService {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM", Locale.ENGLISH);

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    public HRDashboardResponse getDashboardSummary(Long tenantId) {
        LocalDate today = LocalDate.now();

        List<Employee> employees =
                employeeRepository.findByTenantIdOrderByFirstNameAsc(tenantId);

        List<Attendance> attendanceRecords =
                attendanceRepository.findByTenantIdOrderByAttendanceDateDesc(tenantId);

        List<LeaveRequest> leaveRequests =
                leaveRequestRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);

        Payroll latestPayroll = payrollRepository
                .findFirstByTenantIdOrderByCreatedAtDesc(tenantId)
                .orElse(null);

        long headcount = employees.size();

        List<Attendance> todayAttendance = attendanceRecords.stream()
                .filter(item -> today.equals(item.getAttendanceDate()))
                .toList();

        long presentToday = todayAttendance.stream()
                .filter(this::isPresent)
                .count();

        double attendanceRate = todayAttendance.isEmpty()
                ? 0.0
                : (presentToday * 100.0) / todayAttendance.size();

        long pendingLeaves = leaveRequests.stream()
                .filter(item -> "PENDING".equalsIgnoreCase(item.getStatus()))
                .count();

        long onLeaveToday = leaveRequests.stream()
                .filter(item -> "APPROVED".equalsIgnoreCase(item.getStatus()))
                .filter(item -> item.getStartDate() != null && item.getEndDate() != null)
                .filter(item ->
                        !today.isBefore(item.getStartDate())
                                && !today.isAfter(item.getEndDate())
                )
                .count();

        String payrollAmount = latestPayroll == null
                ? "—"
                : formatCurrency(latestPayroll.getTotalAmount());

        String payrollFooter = latestPayroll == null
                ? "No payroll run created"
                : latestPayroll.getDueDate() == null
                ? "Due date not set"
                : "Due " + latestPayroll.getDueDate().format(DATE_FORMAT);

        List<HRDashboardResponse.StatCardDto> stats = List.of(
                stat("HEADCOUNT", String.valueOf(headcount), "Employees in HR records", false),
                stat(
                        "ATTENDANCE RATE",
                        todayAttendance.isEmpty()
                                ? "—"
                                : formatPercent(attendanceRate),
                        todayAttendance.isEmpty()
                                ? "No attendance recorded today"
                                : presentToday + " present today",
                        false
                ),
                stat(
                        "ON LEAVE TODAY",
                        String.valueOf(onLeaveToday),
                        pendingLeaves + " leave request(s) pending",
                        onLeaveToday > 0
                ),
                stat("PAYROLL", payrollAmount, payrollFooter, false),
                stat(
                        "ATTRITION RISK",
                        "—",
                        "Risk model is not configured",
                        false
                ),
                stat(
                        "OPEN POSITIONS",
                        "—",
                        "Recruitment module is not connected",
                        false
                )
        );

        List<String> insights = buildInsights(
                headcount,
                todayAttendance.size(),
                attendanceRate,
                pendingLeaves,
                latestPayroll
        );

        List<HRDashboardResponse.ApprovalItemDto> pendingApprovals = leaveRequests.stream()
                .filter(item -> "PENDING".equalsIgnoreCase(item.getStatus()))
                .limit(10)
                .map(this::toApproval)
                .toList();

        List<HRDashboardResponse.AttendanceTrendDto> attendanceTrends =
                buildAttendanceTrends(attendanceRecords, today);

        return HRDashboardResponse.builder()
                .totalEmployees(headcount)
                .totalEmployeesChange("Live employee records")
                .monthlyPayroll(payrollAmount)
                .monthlyPayrollPeriod(
                        latestPayroll == null
                                ? "No payroll run"
                                : valueOrDefault(
                                latestPayroll.getFormattedMonth(),
                                latestPayroll.getPayrollMonth(),
                                "Latest payroll"
                        )
                )
                .leaveRequestsPending(pendingLeaves)
                .leaveRequestsDescription(
                        pendingLeaves == 0
                                ? "No leave approvals pending"
                                : pendingLeaves + " awaiting action"
                )
                .attendanceRate(
                        todayAttendance.isEmpty()
                                ? "—"
                                : formatPercent(attendanceRate)
                )
                .attendanceRateToday(
                        todayAttendance.isEmpty()
                                ? "No attendance recorded today"
                                : presentToday + "/" + todayAttendance.size() + " present today"
                )
                .stats(stats)
                .insights(insights)
                .pendingApprovals(pendingApprovals)
                .attendanceTrends(attendanceTrends)
                .build();
    }

    private HRDashboardResponse.StatCardDto stat(
            String label,
            String value,
            String footer,
            boolean warning
    ) {
        return HRDashboardResponse.StatCardDto.builder()
                .label(label)
                .value(value)
                .footer(footer)
                .warning(warning)
                .build();
    }

    private List<String> buildInsights(
            long headcount,
            int attendanceEntriesToday,
            double attendanceRate,
            long pendingLeaves,
            Payroll latestPayroll
    ) {
        String attendanceInsight = attendanceEntriesToday == 0
                ? "No attendance records have been logged today."
                : "Today's attendance rate is " + formatPercent(attendanceRate) + ".";

        String leaveInsight = pendingLeaves == 0
                ? "There are no leave requests awaiting approval."
                : pendingLeaves + " leave request(s) need manager approval.";

        String payrollInsight = latestPayroll == null
                ? "No payroll run has been created yet."
                : "Latest payroll total is " + formatCurrency(latestPayroll.getTotalAmount()) + ".";

        return List.of(
                "Current employee headcount is " + headcount + ".",
                attendanceInsight,
                leaveInsight,
                payrollInsight
        );
    }

    private List<HRDashboardResponse.AttendanceTrendDto> buildAttendanceTrends(
            List<Attendance> attendanceRecords,
            LocalDate today
    ) {
        LocalDate currentWeekStart = today.with(DayOfWeek.MONDAY);

        return java.util.stream.IntStream.rangeClosed(0, 4)
                .mapToObj(weeksAgo -> currentWeekStart.minusWeeks(4L - weeksAgo))
                .map(weekStart -> {
                    LocalDate weekEnd = weekStart.plusDays(6);

                    List<Attendance> weekRecords = attendanceRecords.stream()
                            .filter(item -> item.getAttendanceDate() != null)
                            .filter(item ->
                                    !item.getAttendanceDate().isBefore(weekStart)
                                            && !item.getAttendanceDate().isAfter(weekEnd)
                            )
                            .toList();

                    if (weekRecords.isEmpty()) {
                        return null;
                    }

                    long present = weekRecords.stream()
                            .filter(this::isPresent)
                            .count();

                    double rate = (present * 100.0) / weekRecords.size();

                    return new HRDashboardResponse.AttendanceTrendDto(
                            weekStart.format(DATE_FORMAT),
                            round(rate)
                    );
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    private HRDashboardResponse.ApprovalItemDto toApproval(LeaveRequest leave) {
        String employeeName = valueOrDefault(leave.getEmployeeName(), "Unknown employee");
        String days = valueOrDefault(leave.getDays(), "—");
        String leaveCode = valueOrDefault(leave.getLeaveCode(), "LEAVE");

        return HRDashboardResponse.ApprovalItemDto.builder()
                .id(String.valueOf(leave.getId()))
                .title(leaveCode + " · " + employeeName + " · " + days)
                .type(valueOrDefault(leave.getLeaveType(), "Leave request"))
                .amount("—")
                .urgent(false)
                .status(valueOrDefault(leave.getStatus(), "PENDING"))
                .build();
    }

    private boolean isPresent(Attendance attendance) {
        String status = attendance.getStatus();

        return status != null
                && !"ABSENT".equalsIgnoreCase(status)
                && !"LEAVE".equalsIgnoreCase(status);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "₹0.00";
        }

        return "₹" + amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private String formatPercent(double value) {
        return String.format(Locale.ENGLISH, "%.1f%%", value);
    }

    private double round(double value) {
        return BigDecimal.valueOf(value)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private String valueOrDefault(String first, String second, String fallback) {
        if (first != null && !first.isBlank()) {
            return first;
        }

        if (second != null && !second.isBlank()) {
            return second;
        }

        return fallback;
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}