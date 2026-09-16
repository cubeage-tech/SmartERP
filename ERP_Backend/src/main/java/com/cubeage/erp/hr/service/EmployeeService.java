package com.cubeage.erp.hr.service;

import com.cubeage.erp.hr.dto.employee.CreateEmployeeRequest;
import com.cubeage.erp.hr.dto.employee.EmployeeResponse;
import com.cubeage.erp.hr.dto.employee.UpdateEmployeeRequest;
import com.cubeage.erp.hr.entity.Employee;
import com.cubeage.erp.hr.mapper.EmployeeMapper;
import com.cubeage.erp.hr.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees(Long tenantId) {
        return employeeRepository.findByTenantIdOrderByFirstNameAsc(tenantId)
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployee(Long tenantId, Long id) {
        Employee employee = employeeRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        return employeeMapper.toResponse(employee);
    }

    public EmployeeResponse createEmployee(
            Long tenantId,
            CreateEmployeeRequest request
    ) {
        if (employeeRepository.existsByTenantIdAndEmployeeCode(
                tenantId,
                request.getEmployeeCode()
        )) {
            throw new IllegalArgumentException("Employee code already exists");
        }

        if (employeeRepository.existsByTenantIdAndEmail(
                tenantId,
                request.getEmail()
        )) {
            throw new IllegalArgumentException("Employee email already exists");
        }

        Employee employee = employeeMapper.toEntity(request, tenantId);

        return employeeMapper.toResponse(
                employeeRepository.save(employee)
        );
    }

    public EmployeeResponse updateEmployee(
            Long tenantId,
            Long id,
            UpdateEmployeeRequest request
    ) {
        Employee employee = employeeRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        if (!employee.getEmail().equalsIgnoreCase(request.getEmail())
                && employeeRepository.existsByTenantIdAndEmail(
                        tenantId,
                        request.getEmail()
                )) {
            throw new IllegalArgumentException("Employee email already exists");
        }

        employeeMapper.updateEntity(employee, request);

        return employeeMapper.toResponse(
                employeeRepository.save(employee)
        );
    }

    public void deleteEmployee(Long tenantId, Long id) {
        Employee employee = employeeRepository
                .findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        employeeRepository.delete(employee);
    }
}