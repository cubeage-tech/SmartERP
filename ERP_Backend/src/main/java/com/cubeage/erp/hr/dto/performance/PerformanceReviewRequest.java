package com.cubeage.erp.hr.dto.performance;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReviewRequest {

    private Long employeeId;
    private String employeeName;
    private String initials;
    private String designation;
    private String department;
    private Integer rating;
    private String reviewPeriod;
    private String status;
    private String feedback;
}
