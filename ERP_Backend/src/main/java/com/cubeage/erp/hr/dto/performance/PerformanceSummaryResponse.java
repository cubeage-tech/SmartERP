package com.cubeage.erp.hr.dto.performance;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceSummaryResponse {

    private String reviewPeriod;
    private String description;
    private List<PerformanceReviewResponse> reviews;
    private List<DepartmentScoreResponse> departmentScores;
}
