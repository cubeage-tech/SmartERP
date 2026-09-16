package com.cubeage.erp.hr.dto.leave;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDto {

    private Long employeeId;
    private String employeeName;
    private String department;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String from;
    private String to;
    private String days;
    private Double numberOfDays;
    private String reason;
    private String contactDuringLeave;
    private String attachmentUrl;
    private LocalDate appliedOn;
}
