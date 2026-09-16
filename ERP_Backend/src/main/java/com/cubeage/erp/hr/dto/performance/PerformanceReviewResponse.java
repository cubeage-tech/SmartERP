package com.cubeage.erp.hr.dto.performance;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReviewResponse {

    private Long id;
    private Long tenantId;
    private Long employeeId;
    private String initials;
    private String name;
    private String employeeName;
    private String designation;
    private String department;
    private Integer rating;
    private String reviewPeriod;
    private String status;
    private String feedback;

    public Object[] toArray() {
        return new Object[]{
                initials != null ? initials : "EM",
                name != null ? name : (employeeName != null ? employeeName : "—"),
                designation != null ? designation : "—",
                rating != null ? rating : 4,
                status != null ? status : "ON TRACK"
        };
    }
}
