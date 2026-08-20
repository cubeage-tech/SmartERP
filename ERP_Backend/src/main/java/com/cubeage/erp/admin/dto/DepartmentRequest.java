package com.cubeage.erp.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequest {

    @NotNull
    private Long tenantId;

    @NotNull
    private Long branchId;

    @NotBlank
    private String name;

    private Long parentDepartmentId;
}