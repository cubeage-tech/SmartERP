package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.CreateUserRequest;
import com.cubeage.erp.admin.dto.UpdateUserRequest;
import com.cubeage.erp.admin.dto.UserResponse;
import com.cubeage.erp.admin.service.UserService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TENANT_ADMIN')")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        Long tenantId = SecurityUtils.currentTenantId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(tenantId, request));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        Long tenantId = SecurityUtils.currentTenantId();

        return ResponseEntity.ok(userService.getAllUsers(tenantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        Long tenantId = SecurityUtils.currentTenantId();

        return ResponseEntity.ok(userService.getUser(id, tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        Long tenantId = SecurityUtils.currentTenantId();

        return ResponseEntity.ok(userService.updateUser(id, tenantId, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> changeStatus(
            @PathVariable Long id,
            @RequestParam Boolean active
    ) {
        Long tenantId = SecurityUtils.currentTenantId();

        return ResponseEntity.ok(
                userService.changeStatus(id, tenantId, active)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Long tenantId = SecurityUtils.currentTenantId();

        userService.deleteUser(id, tenantId);

        return ResponseEntity.noContent().build();
    }
}