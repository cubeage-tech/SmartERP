package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.DepartmentRequest;
import com.cubeage.erp.admin.entity.Department;
import com.cubeage.erp.admin.service.DepartmentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/v1/admin/departments"
)
@RequiredArgsConstructor
@PreAuthorize(
        "hasRole('TENANT_ADMIN')"
)
public class DepartmentController {

    private final DepartmentService
            departmentService;

    @PostMapping
    public ResponseEntity<Department>
    createDepartment(
            @Valid
            @RequestBody
            DepartmentRequest request
    ) {

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        departmentService
                                .create(
                                        request
                                )
                );
    }

    @GetMapping
    public ResponseEntity<List<Department>>
    getDepartments(
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                departmentService
                        .getAll(
                                tenantId
                        )
        );
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Department>>
    getDepartmentsByBranch(
            @PathVariable Long branchId
    ) {

        return ResponseEntity.ok(
                departmentService
                        .getByBranch(
                                branchId
                        )
        );
    }
}