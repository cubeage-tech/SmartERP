package com.cubeage.erp.hr.dto.leave;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceResponse {

    private Double totalLeaves;
    private Double remainingLeaves;
    private Double pendingLeaves;
    private Double takenLeaves;
    private Integer leaveYear;
    private Long employeeId;
    private String employeeName;
}
