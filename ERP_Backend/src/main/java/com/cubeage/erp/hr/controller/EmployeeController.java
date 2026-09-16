package com.cubeage.erp.hr.controller;

import com.cubeage.erp.hr.dto.employee.CreateEmployeeRequest;
import com.cubeage.erp.hr.dto.employee.EmployeeResponse;
import com.cubeage.erp.hr.dto.employee.UpdateEmployeeRequest;
import com.cubeage.erp.hr.service.EmployeeService;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hr/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    private Long resolveTenantId(Long tenantId) {
        if (tenantId != null) {
            return tenantId;
        }
        Long contextTenantId = TenantContext.getTenantId();
        if (contextTenantId != null) {
            return contextTenantId;
        }
        try {
            return SecurityUtils.currentTenantId();
        } catch (Exception e) {
            return 1L;
        }
    }

    @GetMapping
    public List<EmployeeResponse> getAllEmployees(
            @RequestParam(required = false) Long tenantId
    ) {
        return employeeService.getAllEmployees(resolveTenantId(tenantId));
    }

    @GetMapping("/{id}")
    public EmployeeResponse getEmployee(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        return employeeService.getEmployee(resolveTenantId(tenantId), id);
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @RequestParam(required = false) Long tenantId,
            @RequestBody CreateEmployeeRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(resolveTenantId(tenantId), request));
    }

    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id,
            @RequestBody UpdateEmployeeRequest request
    ) {
        return employeeService.updateEmployee(resolveTenantId(tenantId), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(
            @RequestParam(required = false) Long tenantId,
            @PathVariable Long id
    ) {
        employeeService.deleteEmployee(resolveTenantId(tenantId), id);
    }
}