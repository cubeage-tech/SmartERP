package com.cubeage.erp.settings.mapper;

import com.cubeage.erp.settings.dto.approval.ApprovalWorkflowResponse;
import com.cubeage.erp.settings.entity.ApprovalWorkflowSetting;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ApprovalWorkflowMapper {

    public ApprovalWorkflowResponse toResponse(ApprovalWorkflowSetting workflow) {
        return new ApprovalWorkflowResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getModule(),
                workflow.getTriggerAction(),
                workflow.getApprovalMode(),
                workflow.getMinimumApprovers(),
                deserializeRoleIds(workflow.getApproverRoleIds()),
                workflow.getStatus(),
                workflow.getConfigurationJson(),
                workflow.getCreatedAt(),
                workflow.getUpdatedAt()
        );
    }

    public String serializeRoleIds(Set<Long> roleIds) {
        return roleIds.stream()
                .sorted()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    private Set<Long> deserializeRoleIds(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }
        return Arrays.stream(value.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
