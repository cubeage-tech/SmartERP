package com.cubeage.erp.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank(message = "Full name is required")
    private String name;

    @NotBlank(message = "Position is required")
    private String position;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Please select a role")
    private Long roleId;

    private Boolean active = true;

    private Long branchId;

    private Long departmentId;
<<<<<<< HEAD
}
=======
}
>>>>>>> ff3c9de (Add UpdateUserRequest DTO)
