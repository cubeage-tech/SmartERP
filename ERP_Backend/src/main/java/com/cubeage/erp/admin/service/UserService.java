package com.cubeage.erp.admin.service;

import com.cubeage.erp.admin.dto.CreateUserRequest;
import com.cubeage.erp.admin.dto.UserResponse;
import com.cubeage.erp.admin.entity.Branch;
import com.cubeage.erp.admin.entity.Department;
import com.cubeage.erp.admin.entity.Role;
import com.cubeage.erp.admin.entity.User;
import com.cubeage.erp.admin.mapper.UserMapper;
import com.cubeage.erp.admin.repository.BranchRepository;
import com.cubeage.erp.admin.repository.DepartmentRepository;
import com.cubeage.erp.admin.repository.RoleRepository;
import com.cubeage.erp.admin.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final BranchRepository branchRepository;

    private final DepartmentRepository departmentRepository;

    private final RoleRepository roleRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser(
            CreateUserRequest request
    ) {

        String email =
                request
                        .getEmail()
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        );

        if (userRepository
                .existsByTenantIdAndEmailIgnoreCase(
                        request.getTenantId(),
                        email
                )) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        Branch branch = null;

        if (request.getBranchId() != null) {

            branch =
                    branchRepository
                            .findByIdAndTenantId(
                                    request.getBranchId(),
                                    request.getTenantId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Branch not found"
                                    )
                            );
        }

        Department department = null;

        if (request.getDepartmentId()
                != null) {

            department =
                    departmentRepository
                            .findByIdAndTenantId(
                                    request
                                            .getDepartmentId(),
                                    request
                                            .getTenantId()
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Department not found"
                                    )
                            );

            if (branch != null &&
                    !department
                            .getBranch()
                            .getId()
                            .equals(
                                    branch.getId()
                            )) {

                throw new RuntimeException(
                        "Department does not belong to selected branch"
                );
            }
        }

        Set<Role> roles =
                validateRoles(
                        request.getRoleIds(),
                        request.getTenantId()
                );

        User user =
                User.builder()
                        .tenantId(
                                request.getTenantId()
                        )
                        .name(
                                request.getName()
                        )
                        .email(email)

                        .passwordHash(
                                passwordEncoder
                                        .encode(
                                                request
                                                        .getPassword()
                                        )
                        )

                        .branch(branch)

                        .department(
                                department
                        )

                        .roles(roles)

                        .active(true)

                        .build();

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(
            Long tenantId
    ) {

        return userRepository
                .findByTenantIdOrderByIdDesc(
                        tenantId
                )
                .stream()
                .map(
                        userMapper::toResponse
                )
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(
            Long id,
            Long tenantId
    ) {

        return userMapper.toResponse(
                getUserEntity(
                        id,
                        tenantId
                )
        );
    }

    public UserResponse changeStatus(
            Long id,
            Long tenantId,
            Boolean active
    ) {

        User user =
                getUserEntity(
                        id,
                        tenantId
                );

        user.setActive(active);

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    public UserResponse assignRoles(
            Long userId,
            Long tenantId,
            Set<Long> roleIds
    ) {

        User user =
                getUserEntity(
                        userId,
                        tenantId
                );

        Set<Role> roles =
                validateRoles(
                        roleIds,
                        tenantId
                );

        user.setRoles(roles);

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    private User getUserEntity(
            Long id,
            Long tenantId
    ) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!user
                .getTenantId()
                .equals(tenantId)) {

            throw new RuntimeException(
                    "User does not belong to this tenant"
            );
        }

        return user;
    }

    private Set<Role> validateRoles(
            Set<Long> roleIds,
            Long tenantId
    ) {

        if (roleIds == null
                || roleIds.isEmpty()) {

            return new HashSet<>();
        }

        List<Role> roles =
                roleRepository
                        .findAllById(
                                roleIds
                        );

        if (roles.size()
                != roleIds.size()) {

            throw new RuntimeException(
                    "One or more roles not found"
            );
        }

        boolean wrongTenant =
                roles.stream()
                        .anyMatch(
                                role ->
                                        !role
                                                .getTenantId()
                                                .equals(
                                                        tenantId
                                                )
                        );

        if (wrongTenant) {

            throw new RuntimeException(
                    "Role does not belong to this tenant"
            );
        }

        return new HashSet<>(
                roles
        );
    }
}