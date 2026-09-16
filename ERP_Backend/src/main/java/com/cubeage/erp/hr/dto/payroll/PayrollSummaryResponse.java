package com.cubeage.erp.hr.dto.payroll;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollSummaryResponse {

    private String month;
    private Integer employeeCount;
    private String totalAmount;
    private BigDecimal totalAmountNumeric;
    private String dueDate;
    private String description;
    private List<DepartmentPayrollDto> departments;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentPayrollDto {
        private String name;
        private String staff;
        private Integer staffCount;
        private String total;
        private BigDecimal totalAmount;
        private String average;
        private BigDecimal averageAmount;

        public String[] toArray() {
            return new String[]{name, staff, total, average};
        }
    }
}
