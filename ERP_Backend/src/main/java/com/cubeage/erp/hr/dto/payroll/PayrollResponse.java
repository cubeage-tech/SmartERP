package com.cubeage.erp.hr.dto.payroll;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {

    private Long id;
    private Long tenantId;
    private String payrollMonth;
    private String formattedMonth;
    private Integer totalEmployees;
    private BigDecimal totalAmount;
    private String formattedTotalAmount;
    private LocalDate dueDate;
    private String status;
}
