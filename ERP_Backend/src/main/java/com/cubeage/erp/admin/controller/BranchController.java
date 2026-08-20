package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.BranchRequest;
import com.cubeage.erp.admin.entity.Branch;
import com.cubeage.erp.admin.service.BranchService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/v1/admin/branches"
)
@RequiredArgsConstructor
@PreAuthorize(
        "hasRole('TENANT_ADMIN')"
)
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    public ResponseEntity<Branch>
    createBranch(
            @Valid
            @RequestBody
            BranchRequest request
    ) {

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        branchService.create(
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<Branch>>
    getBranches(
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                branchService.getAll(
                        tenantId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Branch>
    getBranch(
            @PathVariable Long id,

            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                branchService.getById(
                        id,
                        tenantId
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Branch>
    updateBranch(
            @PathVariable Long id,

            @Valid
            @RequestBody
            BranchRequest request
    ) {

        return ResponseEntity.ok(
                branchService.update(
                        id,
                        request
                )
        );
    }
}