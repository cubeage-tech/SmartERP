package com.cubeage.erp.hr.service;

import com.cubeage.erp.hr.dto.attendance.AttendanceRequest;
import com.cubeage.erp.hr.dto.attendance.AttendanceResponse;
import com.cubeage.erp.hr.dto.dashboard.HRDashboardResponse;
import com.cubeage.erp.hr.dto.employee.CreateEmployeeRequest;
import com.cubeage.erp.hr.dto.employee.EmployeeResponse;
import com.cubeage.erp.hr.dto.employee.UpdateEmployeeRequest;
import com.cubeage.erp.hr.dto.leave.LeaveRequestDto;
import com.cubeage.erp.hr.dto.leave.LeaveResponse;
import com.cubeage.erp.hr.dto.payroll.PayrollRequest;
import com.cubeage.erp.hr.dto.payroll.PayrollResponse;
import com.cubeage.erp.hr.dto.payroll.PayrollSummaryResponse;
import com.cubeage.erp.hr.dto.performance.PerformanceReviewRequest;
import com.cubeage.erp.hr.dto.performance.PerformanceSummaryResponse;
import com.cubeage.erp.hr.entity.Employee;
import com.cubeage.erp.hr.entity.LeaveRequest;
import com.cubeage.erp.hr.entity.Payroll;
import com.cubeage.erp.hr.mapper.EmployeeMapper;
import com.cubeage.erp.hr.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class HRServiceTest {

    private EmployeeRepository employeeRepository;
    private EmployeeMapper employeeMapper;
    private EmployeeService employeeService;

    private AttendanceRepository attendanceRepository;
    private AttendanceService attendanceService;

    private LeaveRequestRepository leaveRepository;
    private LeaveService leaveService;

    private PayrollRepository payrollRepository;
    private PayrollService payrollService;

    private PerformanceReviewRepository performanceRepository;
    private PerformanceService performanceService;

    private HRDashboardService hrDashboardService;

    @BeforeEach
    void setUp() {
        employeeRepository = mock(EmployeeRepository.class);
        employeeMapper = new EmployeeMapper();
        employeeService = new EmployeeService(employeeRepository, employeeMapper);

        attendanceRepository = mock(AttendanceRepository.class);
        attendanceService = new AttendanceService(attendanceRepository);

        leaveRepository = mock(LeaveRequestRepository.class);
        leaveService = new LeaveService(leaveRepository);

        payrollRepository = mock(PayrollRepository.class);
        payrollService = new PayrollService(payrollRepository, employeeRepository);

        performanceRepository = mock(PerformanceReviewRepository.class);
        performanceService = new PerformanceService(performanceRepository);

        hrDashboardService = new HRDashboardService(
            employeeRepository,
            attendanceRepository,
            leaveRepository,
            payrollRepository
        );

        when(employeeRepository.save(any())).thenAnswer(invocation -> {
            Employee emp = invocation.getArgument(0);
            if (emp.getId() == null) emp.setId(101L);
            return emp;
        });

        when(leaveRepository.save(any())).thenAnswer(invocation -> {
            LeaveRequest req = invocation.getArgument(0);
            if (req.getId() == null) req.setId(201L);
            return req;
        });
    }

    @Test
    void testEmployeeCRUDAndFieldMapping() {
        CreateEmployeeRequest createRequest = CreateEmployeeRequest.builder()
                .employeeCode("EMP001")
                .firstName("Arjun")
                .lastName("Mehta")
                .email("arjun@example.com")
                .department("Management")
                .designation("Managing Director")
                .branch("Mumbai Branch")
                .joiningDate(LocalDate.of(2023, 1, 15))
                .salary(new BigDecimal("184000.00"))
                .status("Active")
                .build();

        EmployeeResponse created = employeeService.createEmployee(1L, createRequest);
        assertNotNull(created);
        assertEquals("Arjun Mehta", created.getName());
        assertEquals("AM", created.getInitials());
        assertEquals("2023-01-15", created.getJoined());
        assertTrue(created.getFormattedSalary().contains("184,000"));

        when(employeeRepository.findByIdAndTenantId(101L, 1L)).thenReturn(Optional.of(
                employeeMapper.toEntity(createRequest, 1L)
        ));

        UpdateEmployeeRequest updateRequest = UpdateEmployeeRequest.builder()
                .firstName("Arjun")
                .lastName("Mehta")
                .email("arjun.updated@example.com")
                .department("Executive")
                .designation("CEO")
                .branch("Mumbai Branch")
                .joiningDate(LocalDate.of(2023, 1, 15))
                .salary(new BigDecimal("250000.00"))
                .status("Active")
                .build();

        EmployeeResponse updated = employeeService.updateEmployee(1L, 101L, updateRequest);
        assertNotNull(updated);
        assertEquals("Executive", updated.getDepartment());
    }

    @Test
    void testTenantIsolationOnEmployeeSearch() {
        Employee tenant1Emp = Employee.builder()
                .id(1L)
                .tenantId(1L)
                .firstName("T1")
                .lastName("User")
                .email("t1@test.com")
                .build();

        Employee tenant2Emp = Employee.builder()
                .id(2L)
                .tenantId(2L)
                .firstName("T2")
                .lastName("User")
                .email("t2@test.com")
                .build();

        when(employeeRepository.findByTenantIdOrderByFirstNameAsc(1L)).thenReturn(List.of(tenant1Emp));
        when(employeeRepository.findByTenantIdOrderByFirstNameAsc(2L)).thenReturn(List.of(tenant2Emp));

        List<EmployeeResponse> t1List = employeeService.getAllEmployees(1L);
        assertEquals(1, t1List.size());
        assertEquals("T1 User", t1List.get(0).getName());

        List<EmployeeResponse> t2List = employeeService.getAllEmployees(2L);
        assertEquals(1, t2List.size());
        assertEquals("T2 User", t2List.get(0).getName());
    }

    @Test
    void testHRDashboardSummary() {
        when(employeeRepository.findByTenantIdOrderByFirstNameAsc(1L)).thenReturn(List.of(
                Employee.builder().id(1L).tenantId(1L).salary(new BigDecimal("100000")).build()
        ));

        HRDashboardResponse summary = hrDashboardService.getDashboardSummary(1L);
        assertNotNull(summary);
        assertEquals(1L, summary.getTotalEmployees());
        assertFalse(summary.getStats().isEmpty());
        assertFalse(summary.getInsights().isEmpty());
    }

    @Test
    void testAttendanceLoggingAndRetrieval() {
        List<AttendanceResponse> defaultList = attendanceService.getAttendanceRecords(1L);
        assertFalse(defaultList.isEmpty());
        assertEquals("Mon, 05 Aug", defaultList.get(0).getDate());

        when(attendanceRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AttendanceRequest logReq = AttendanceRequest.builder()
                .employeeId(1L)
                .employeeName("Test User")
                .attendanceDate(LocalDate.now())
                .checkIn("09:00")
                .checkOut("18:00")
                .hours("9h 00m")
                .status("PRESENT")
                .build();

        AttendanceResponse logged = attendanceService.logAttendance(1L, logReq);
        assertNotNull(logged);
        assertEquals("09:00", logged.getCheckIn());
    }

    @Test
    void testLeaveRequestAndApprovalFlow() {
        LeaveRequestDto leaveReq = LeaveRequestDto.builder()
                .employeeId(1L)
                .employeeName("Rohan Verma")
                .department("Sales")
                .leaveType("Sick Leave")
                .startDate(LocalDate.of(2026, 8, 11))
                .endDate(LocalDate.of(2026, 8, 12))
                .days("2d")
                .reason("Flu")
                .build();

        LeaveResponse created = leaveService.createLeave(1L, leaveReq);
        assertNotNull(created);
        assertEquals("PENDING", created.getStatus());

        LeaveRequest existingLeave = LeaveRequest.builder()
                .id(201L)
                .tenantId(1L)
                .status("PENDING")
                .build();
        when(leaveRepository.findByIdAndTenantId(201L, 1L)).thenReturn(Optional.of(existingLeave));

        LeaveResponse approved = leaveService.approveLeave(1L, 201L);
        assertEquals("APPROVED", approved.getStatus());

        LeaveResponse rejected = leaveService.rejectLeave(1L, 201L);
        assertEquals("REJECTED", rejected.getStatus());
    }

    @Test
    void testPayrollSummaryCalculation() {
        when(employeeRepository.findByTenantIdOrderByFirstNameAsc(1L)).thenReturn(List.of(
                Employee.builder().id(1L).tenantId(1L).department("Management").salary(new BigDecimal("100000")).build(),
                Employee.builder().id(2L).tenantId(1L).department("Management").salary(new BigDecimal("150000")).build(),
                Employee.builder().id(3L).tenantId(1L).department("IT").salary(new BigDecimal("80000")).build()
        ));

        PayrollSummaryResponse summary = payrollService.getPayrollSummary(1L);
        assertNotNull(summary);
        assertEquals(3, summary.getEmployeeCount());
        assertEquals(2, summary.getDepartments().size());

        when(payrollRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        PayrollResponse processed = payrollService.processPayroll(1L, new PayrollRequest());
        assertNotNull(processed);
        assertEquals("PROCESSED", processed.getStatus());

        Payroll existing = Payroll.builder().id(99L).tenantId(1L).payrollMonth("2026-08").status("DRAFT").build();
        when(payrollRepository.findByTenantIdAndPayrollMonth(1L, "2026-08")).thenReturn(Optional.of(existing));

        PayrollRequest updateReq = PayrollRequest.builder().payrollMonth("2026-08").build();
        PayrollResponse updatedPayroll = payrollService.processPayroll(1L, updateReq);
        assertNotNull(updatedPayroll);
        assertEquals(99L, updatedPayroll.getId());
        assertEquals("PROCESSED", updatedPayroll.getStatus());
    }

    @Test
    void testPerformanceReviewsAndScores() {
        PerformanceSummaryResponse summary = performanceService.getSummary(1L);
        assertNotNull(summary);
        assertFalse(summary.getReviews().isEmpty());
        assertFalse(summary.getDepartmentScores().isEmpty());

        when(performanceRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        PerformanceReviewRequest req = PerformanceReviewRequest.builder()
                .employeeId(1L)
                .employeeName("Jane Doe")
                .designation("Engineer")
                .rating(5)
                .build();
        var review = performanceService.addReview(1L, req);
        assertNotNull(review);
        assertEquals("JD", review.getInitials());
    }
}
