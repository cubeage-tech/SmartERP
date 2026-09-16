package com.cubeage.erp.hr.dto.attendance;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    private Long employeeId;
    private String employeeName;
    private LocalDate attendanceDate;
    private String checkIn;
    private String checkOut;
    private String hours;
    private String status;
}
