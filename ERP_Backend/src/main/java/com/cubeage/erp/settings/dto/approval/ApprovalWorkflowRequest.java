package com.cubeage.erp.settings.dto.approval;

import com.cubeage.erp.settings.enums.ApprovalMode;
import com.cubeage.erp.settings.enums.ModuleType;
import jakarta.validation.constraints.*;

import java.util.Set;

public record ApprovalWorkflowRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull ModuleType module,
        @NotBlank @Size(max = 80) String triggerAction,
        @NotNull ApprovalMode approvalMode,
        @NotNull @Min(1) @Max(25) Integer minimumApprovers,
        @NotEmpty Set<@Positive Long> approverRoleIds,
        boolean active,
        String configurationJson
) { }
