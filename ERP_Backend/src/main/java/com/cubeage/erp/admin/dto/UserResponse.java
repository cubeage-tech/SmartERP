package com.cubeage.erp.admin.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private Long tenantId;

    private String name;

    private String email;

    private Boolean active;

    private Long branchId;

    private String branchName;

    private Long departmentId;

    private String departmentName;

    private Set<String> roles;
}