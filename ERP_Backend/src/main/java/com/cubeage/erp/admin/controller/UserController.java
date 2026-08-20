package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.CreateUserRequest;
import com.cubeage.erp.admin.dto.UserResponse;
import com.cubeage.erp.admin.service.UserService;

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
        "/api/v1/admin/users"
)
@RequiredArgsConstructor
@PreAuthorize(
        "hasRole('TENANT_ADMIN')"
)
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse>
    createUser(
            @Valid
            @RequestBody
            CreateUserRequest request
    ) {

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        userService
                                .createUser(
                                        request
                                )
                );
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>>
    getUsers(
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                userService
                        .getAllUsers(
                                tenantId
                        )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse>
    getUser(
            @PathVariable Long id,
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                userService.getUser(
                        id,
                        tenantId
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse>
    changeStatus(
            @PathVariable Long id,

            @RequestParam Long tenantId,

            @RequestParam Boolean active
    ) {

        return ResponseEntity.ok(
                userService.changeStatus(
                        id,
                        tenantId,
                        active
                )
        );
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<UserResponse>
    assignRoles(
            @PathVariable Long id,

            @RequestParam Long tenantId,

            @RequestBody
            Set<Long> roleIds
    ) {

        return ResponseEntity.ok(
                userService.assignRoles(
                        id,
                        tenantId,
                        roleIds
                )
        );
    }
}