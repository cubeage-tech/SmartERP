package com.cubeage.erp.hr.dto.attendance;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;
    private Long tenantId;
    private Long employeeId;
    private String employeeName;
    private LocalDate attendanceDate;
    private String date;
    private String checkIn;
    private String checkOut;
    private String hours;
    private String status;

    public Object[] toRow() {
        return new Object[]{
                date != null ? date : (attendanceDate != null ? attendanceDate.toString() : "—"),
                checkIn != null ? checkIn : "-",
                checkOut != null ? checkOut : "-",
                hours != null ? hours : "—",
                status != null ? status : "PRESENT"
        };
    }
}
