package com.cubeage.erp.admin.controller;

import com.cubeage.erp.admin.dto.AdminDashboardResponse;
import com.cubeage.erp.admin.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        "/api/v1/admin/dashboard"
)
@RequiredArgsConstructor
@PreAuthorize(
        "hasRole('TENANT_ADMIN')"
)
public class AdminDashboardController {

    private final AdminDashboardService
            adminDashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse>
    getDashboard(
            @RequestParam Long tenantId
    ) {

        return ResponseEntity.ok(
                adminDashboardService
                        .getDashboard(
                                tenantId
                        )
        );
    }
}