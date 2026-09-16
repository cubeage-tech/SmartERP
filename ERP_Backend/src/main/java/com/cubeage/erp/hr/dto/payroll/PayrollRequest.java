package com.cubeage.erp.hr.dto.payroll;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRequest {

    private String payrollMonth;
    private String formattedMonth;
    private Integer totalEmployees;
    private BigDecimal totalAmount;
    private LocalDate dueDate;
}
