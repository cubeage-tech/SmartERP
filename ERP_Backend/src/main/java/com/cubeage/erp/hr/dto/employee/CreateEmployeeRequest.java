package com.cubeage.erp.hr.dto.employee;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String department;

    private String designation;

    private String branch;

    private LocalDate joiningDate;

    private BigDecimal salary;

    private String status;

    private Long userId;
}