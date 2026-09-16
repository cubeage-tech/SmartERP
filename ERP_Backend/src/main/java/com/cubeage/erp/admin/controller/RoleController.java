package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.RoleRequest;
import com.cubeage.erp.admin.entity.Permission;
import com.cubeage.erp.admin.entity.Role;
import com.cubeage.erp.admin.service.PermissionService;
import com.cubeage.erp.admin.service.RoleService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(
        "/api/v1/admin/roles"
)
@RequiredArgsConstructor
@PreAuthorize(
        "hasAnyRole('SUPER_ADMIN','TENANT_ADMIN')"
)
public class RoleController {

    private final RoleService roleService;

    private final PermissionService
            permissionService;

    @PostMapping
    public ResponseEntity<Role>
    createRole(
            @Valid
            @RequestBody RoleRequest request
    ) {

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        roleService
                                .createRole(
                                        request
                                )
                );
    }

    @GetMapping
    public ResponseEntity<List<Role>>
    getRoles(
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                roleService.getRoles(
                        tenantId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role>
    getRole(
            @PathVariable Long id,

            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                roleService.getRole(
                        id,
                        tenantId
                )
        );
    }

    @PutMapping(
            "/{id}/permissions"
    )
    public ResponseEntity<Role>
    updatePermissions(
            @PathVariable Long id,

            @RequestParam Long tenantId,

            @RequestBody
            Set<Long> permissionIds
    ) {

        return ResponseEntity.ok(
                roleService
                        .updatePermissions(
                                id,
                                tenantId,
                                permissionIds
                        )
        );
    }

    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>>
    getPermissions() {

        return ResponseEntity.ok(
                permissionService
                        .getAllPermissions()
        );
    }
}