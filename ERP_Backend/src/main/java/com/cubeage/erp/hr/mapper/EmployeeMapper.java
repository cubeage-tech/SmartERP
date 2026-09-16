package com.cubeage.erp.hr.mapper;

import com.cubeage.erp.hr.dto.employee.CreateEmployeeRequest;
import com.cubeage.erp.hr.dto.employee.EmployeeResponse;
import com.cubeage.erp.hr.dto.employee.UpdateEmployeeRequest;
import com.cubeage.erp.hr.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(CreateEmployeeRequest request, Long tenantId) {
        return Employee.builder()
                .tenantId(tenantId)
                .employeeCode(request.getEmployeeCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .branch(request.getBranch())
                .joiningDate(request.getJoiningDate())
                .salary(request.getSalary())
                .status(request.getStatus())
                .userId(request.getUserId())
                .build();
    }

    public void updateEntity(Employee employee, UpdateEmployeeRequest request) {
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setBranch(request.getBranch());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(request.getSalary());
        employee.setStatus(request.getStatus());
        employee.setUserId(request.getUserId());
    }

    public EmployeeResponse toResponse(Employee employee) {
        String first = employee.getFirstName() != null ? employee.getFirstName() : "";
        String last = employee.getLastName() != null ? employee.getLastName() : "";
        String fullName = (first + " " + last).trim();

        String initials = "";
        if (!first.isEmpty()) initials += first.substring(0, 1).toUpperCase();
        if (!last.isEmpty()) initials += last.substring(0, 1).toUpperCase();
        if (initials.isEmpty()) initials = "EM";

        String joined = employee.getJoiningDate() != null ? employee.getJoiningDate().toString() : "—";

        String formattedSalary = "—";
        if (employee.getSalary() != null) {
            formattedSalary = "₹" + String.format("%,.2f", employee.getSalary().doubleValue());
        }

        return EmployeeResponse.builder()
                .id(employee.getId())
                .tenantId(employee.getTenantId())
                .employeeCode(employee.getEmployeeCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .name(fullName)
                .initials(initials)
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .branch(employee.getBranch())
                .joiningDate(employee.getJoiningDate())
                .joined(joined)
                .salary(employee.getSalary())
                .formattedSalary(formattedSalary)
                .status(employee.getStatus())
                .userId(employee.getUserId())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}