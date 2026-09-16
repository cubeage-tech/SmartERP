package com.cubeage.erp.hr.dto.leave;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {

    private Long id;
    private Long tenantId;
    private String leaveCode;

    // Both UI aliases and standard names to support all frontend variants
    private Long employeeId;
    private String employee;
    private String employeeName;

    private String dept;
    private String department;

    private String type;
    private String leaveType;

    private LocalDate startDate;
    private LocalDate endDate;
    private String from;
    private String to;

    private String days;
    private Double numberOfDays;
    private String reason;
    private String status;
    private String contactDuringLeave;
    private String attachmentUrl;
    private LocalDate appliedOn;
}
