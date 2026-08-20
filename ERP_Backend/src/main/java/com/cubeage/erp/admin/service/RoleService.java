package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.dto.RoleRequest;
import com.cubeage.erp.admin.entity.Permission;
import com.cubeage.erp.admin.entity.Role;
import com.cubeage.erp.admin.repository.PermissionRepository;
import com.cubeage.erp.admin.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    public Role createRole(
            RoleRequest request
    ) {

        boolean exists =
                roleRepository
                        .existsByTenantIdAndNameIgnoreCase(
                                request.getTenantId(),
                                request.getName()
                        );

        if (exists) {
            throw new RuntimeException(
                    "Role already exists"
            );
        }

        Set<Permission> permissions =
                getPermissions(
                        request.getPermissionIds()
                );

        Role role = Role.builder()
                .tenantId(
                        request.getTenantId()
                )
                .name(
                        request
                                .getName()
                                .trim()
                                .toUpperCase()
                )
                .systemRole(false)
                .permissions(permissions)
                .build();

        return roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public List<Role> getRoles(
            Long tenantId
    ) {

        return roleRepository
                .findByTenantIdOrderByNameAsc(
                        tenantId
                );
    }

    @Transactional(readOnly = true)
    public Role getRole(
            Long roleId,
            Long tenantId
    ) {

        return roleRepository
                .findByIdAndTenantId(
                        roleId,
                        tenantId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Role not found"
                        )
                );
    }

    public Role updatePermissions(
            Long roleId,
            Long tenantId,
            Set<Long> permissionIds
    ) {

        Role role = getRole(
                roleId,
                tenantId
        );

        Set<Permission> permissions =
                getPermissions(
                        permissionIds
                );

        role.setPermissions(
                permissions
        );

        return roleRepository.save(role);
    }

    private Set<Permission> getPermissions(
            Set<Long> permissionIds
    ) {

        if (permissionIds == null
                || permissionIds.isEmpty()) {

            return new HashSet<>();
        }

        List<Permission> permissions =
                permissionRepository
                        .findAllById(
                                permissionIds
                        );

        if (permissions.size()
                != permissionIds.size()) {

            throw new RuntimeException(
                    "One or more permissions not found"
            );
        }

        return new HashSet<>(
                permissions
        );
    }
}