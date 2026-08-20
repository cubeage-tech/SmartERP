package com.cubeage.erp.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BranchRequest {

    @NotNull
    private Long tenantId;

    @NotBlank
    private String name;

    private String address;

    private String currency;
}