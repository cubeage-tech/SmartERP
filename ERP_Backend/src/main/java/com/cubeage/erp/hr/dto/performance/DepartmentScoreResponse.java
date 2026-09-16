package com.cubeage.erp.hr.dto.performance;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentScoreResponse {

    private String department;
    private String score;
    private String percentage;
    private Double numericScore;

    public String[] toArray() {
        return new String[]{department, score, percentage};
    }
}
