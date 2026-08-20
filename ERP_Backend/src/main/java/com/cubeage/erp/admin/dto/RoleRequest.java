package com.cubeage.erp.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class RoleRequest {

    @NotNull
    private Long tenantId;

    @NotBlank
    private String name;

    private Set<Long> permissionIds;
}