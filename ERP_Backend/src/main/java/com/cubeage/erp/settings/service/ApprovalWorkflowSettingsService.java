package com.cubeage.erp.settings.service;

import com.cubeage.erp.admin.repository.RoleRepository;
import com.cubeage.erp.settings.dto.approval.*;
import com.cubeage.erp.settings.entity.ApprovalWorkflowSetting;
import com.cubeage.erp.settings.enums.WorkflowStatus;
import com.cubeage.erp.settings.exception.SettingNotFoundException;
import com.cubeage.erp.settings.mapper.ApprovalWorkflowMapper;
import com.cubeage.erp.settings.repository.ApprovalWorkflowSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprovalWorkflowSettingsService {

    private final ApprovalWorkflowSettingRepository repository;
    private final RoleRepository roleRepository;
    private final ApprovalWorkflowMapper mapper;

    @Transactional(readOnly = true)
    public List<ApprovalWorkflowResponse> list(Long tenantId) {
        return repository.findByTenantIdOrderByName(tenantId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ApprovalWorkflowResponse create(Long tenantId, ApprovalWorkflowRequest request) {
        if (repository.existsByTenantIdAndNameIgnoreCase(tenantId, request.name().trim())) {
            throw new IllegalArgumentException("Approval workflow name already exists");
        }
        validateRoles(tenantId, request);
        ApprovalWorkflowSetting workflow = ApprovalWorkflowSetting.builder()
                .tenantId(tenantId)
                .build();
        apply(workflow, request);
        return mapper.toResponse(repository.save(workflow));
    }

    public ApprovalWorkflowResponse update(Long tenantId, Long id, ApprovalWorkflowRequest request) {
        ApprovalWorkflowSetting workflow = require(tenantId, id);
        if (repository.existsByTenantIdAndNameIgnoreCaseAndIdNot(
                tenantId, request.name().trim(), id)) {
            throw new IllegalArgumentException("Approval workflow name already exists");
        }
        validateRoles(tenantId, request);
        apply(workflow, request);
        return mapper.toResponse(repository.save(workflow));
    }

    public ApprovalWorkflowResponse changeStatus(Long tenantId, Long id, boolean active) {
        ApprovalWorkflowSetting workflow = require(tenantId, id);
        workflow.setStatus(active ? WorkflowStatus.ACTIVE : WorkflowStatus.INACTIVE);
        return mapper.toResponse(repository.save(workflow));
    }

    public void delete(Long tenantId, Long id) {
        repository.delete(require(tenantId, id));
    }

    private void apply(ApprovalWorkflowSetting workflow, ApprovalWorkflowRequest request) {
        workflow.setName(request.name().trim());
        workflow.setModule(request.module());
        workflow.setTriggerAction(request.triggerAction().trim().toUpperCase());
        workflow.setApprovalMode(request.approvalMode());
        workflow.setMinimumApprovers(request.minimumApprovers());
        workflow.setApproverRoleIds(mapper.serializeRoleIds(request.approverRoleIds()));
        workflow.setStatus(request.active() ? WorkflowStatus.ACTIVE : WorkflowStatus.INACTIVE);
        workflow.setConfigurationJson(request.configurationJson());
    }

    private void validateRoles(Long tenantId, ApprovalWorkflowRequest request) {
        long matchingRoles = roleRepository.findAllById(request.approverRoleIds()).stream()
                .filter(role -> tenantId.equals(role.getTenantId()))
                .count();
        if (matchingRoles != request.approverRoleIds().size()) {
            throw new IllegalArgumentException("One or more approver roles do not belong to this tenant");
        }
        if (request.minimumApprovers() > request.approverRoleIds().size()) {
            throw new IllegalArgumentException("Minimum approvers cannot exceed configured approver roles");
        }
    }

    private ApprovalWorkflowSetting require(Long tenantId, Long id) {
        return repository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new SettingNotFoundException("Approval workflow not found"));
    }
}
