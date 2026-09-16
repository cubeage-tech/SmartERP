package com.cubeage.erp.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateUserRequest {

    @NotBlank(message = "Full name is required")
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    @NotNull(message = "Please select a role")
    private Long roleId;

    @NotBlank(message = "Position is required")
    private String position;

    private Boolean active = true;

    private Long branchId;

    private Long departmentId;
}