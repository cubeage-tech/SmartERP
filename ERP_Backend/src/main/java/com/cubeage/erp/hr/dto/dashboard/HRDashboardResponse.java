package com.cubeage.erp.hr.dto.dashboard;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HRDashboardResponse {

    private Long totalEmployees;
    private String totalEmployeesChange;

    private String monthlyPayroll;
    private String monthlyPayrollPeriod;

    private Long leaveRequestsPending;
    private String leaveRequestsDescription;

    private String attendanceRate;
    private String attendanceRateToday;

    private List<StatCardDto> stats;
    private List<String> insights;
    private List<ApprovalItemDto> pendingApprovals;
    private List<AttendanceTrendDto> attendanceTrends;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatCardDto {
        private String label;
        private String value;
        private String footer;
        private boolean warning;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApprovalItemDto {
        private String id;
        private String title;
        private String type;
        private String amount;
        private boolean urgent;
        private String status;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceTrendDto {
        private String label;
        private Double value;
    }
}
