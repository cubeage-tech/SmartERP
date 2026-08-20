package com.cubeage.erp.settings.dto.approval;

import com.cubeage.erp.settings.enums.ApprovalMode;
import com.cubeage.erp.settings.enums.ModuleType;
import com.cubeage.erp.settings.enums.WorkflowStatus;

import java.time.Instant;
import java.util.Set;

public record ApprovalWorkflowResponse(
        Long id,
        String name,
        ModuleType module,
        String triggerAction,
        ApprovalMode approvalMode,
        Integer minimumApprovers,
        Set<Long> approverRoleIds,
        WorkflowStatus status,
        String configurationJson,
        Instant createdAt,
        Instant updatedAt
) { }
