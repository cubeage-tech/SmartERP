package com.cubeage.erp.admin.mapper;

import com.cubeage.erp.admin.dto.UserResponse;
import com.cubeage.erp.admin.entity.Role;
import com.cubeage.erp.admin.entity.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        Set<String> roles = user
                .getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .tenantId(user.getTenantId())
                .name(user.getName())
                .email(user.getEmail())
                .active(user.getActive())

                .branchId(
                        user.getBranch() != null
                                ? user.getBranch().getId()
                                : null
                )

                .branchName(
                        user.getBranch() != null
                                ? user.getBranch().getName()
                                : null
                )

                .departmentId(
                        user.getDepartment() != null
                                ? user.getDepartment().getId()
                                : null
                )

                .departmentName(
                        user.getDepartment() != null
                                ? user.getDepartment().getName()
                                : null
                )

                .roles(roles)

                .build();
    }
}