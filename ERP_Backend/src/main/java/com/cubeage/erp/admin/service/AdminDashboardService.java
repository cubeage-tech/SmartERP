package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.dto.AdminDashboardResponse;
import com.cubeage.erp.admin.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    private final BranchRepository branchRepository;

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(
            Long tenantId
    ) {

        return AdminDashboardResponse
                .builder()

                .totalUsers(
                        userRepository
                                .countByTenantId(
                                        tenantId
                                )
                )

                .activeUsers(
                        userRepository
                                .countByTenantIdAndActiveTrue(
                                        tenantId
                                )
                )

                .totalRoles(
                        roleRepository
                                .countByTenantId(
                                        tenantId
                                )
                )

                .totalPermissions(
                        permissionRepository.count()
                )

                .totalBranches(
                        branchRepository
                                .countByTenantId(
                                        tenantId
                                )
                )

                .totalDepartments(
                        departmentRepository
                                .countByTenantId(
                                        tenantId
                                )
                )

                .build();
    }
}