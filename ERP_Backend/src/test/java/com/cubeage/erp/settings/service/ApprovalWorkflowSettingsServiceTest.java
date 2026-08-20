package com.cubeage.erp.settings.service;

import com.cubeage.erp.admin.entity.Role;
import com.cubeage.erp.admin.repository.RoleRepository;
import com.cubeage.erp.settings.dto.approval.*;
import com.cubeage.erp.settings.entity.ApprovalWorkflowSetting;
import com.cubeage.erp.settings.enums.*;
import com.cubeage.erp.settings.mapper.ApprovalWorkflowMapper;
import com.cubeage.erp.settings.repository.ApprovalWorkflowSettingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ApprovalWorkflowSettingsServiceTest {

    private ApprovalWorkflowSettingRepository repository;
    private RoleRepository roleRepository;
    private ApprovalWorkflowSettingsService service;

    @BeforeEach
    void setUp() {
        repository = mock(ApprovalWorkflowSettingRepository.class);
        roleRepository = mock(RoleRepository.class);
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        service = new ApprovalWorkflowSettingsService(
                repository,
                roleRepository,
                new ApprovalWorkflowMapper()
        );
    }

    @Test
    void createAcceptsOnlyRolesFromTheCurrentTenant() {
        Role tenantRole = Role.builder().id(10L).tenantId(4L).name("FINANCE_MANAGER").build();
        Role anotherTenantRole = Role.builder().id(11L).tenantId(8L).name("ADMIN").build();
        when(roleRepository.findAllById(Set.of(10L, 11L)))
                .thenReturn(List.of(tenantRole, anotherTenantRole));

        ApprovalWorkflowRequest request = request(Set.of(10L, 11L), 1);

        assertThrows(IllegalArgumentException.class, () -> service.create(4L, request));
        verify(repository, never()).save(any());
    }

    @Test
    void createSerializesValidatedApproverRoles() {
        Role first = Role.builder().id(10L).tenantId(4L).name("FINANCE_MANAGER").build();
        Role second = Role.builder().id(12L).tenantId(4L).name("DIRECTOR").build();
        when(roleRepository.findAllById(Set.of(12L, 10L))).thenReturn(List.of(first, second));

        ApprovalWorkflowResponse response = service.create(4L, request(Set.of(12L, 10L), 2));

        assertEquals(Set.of(10L, 12L), response.approverRoleIds());
        assertEquals(WorkflowStatus.ACTIVE, response.status());
    }

    private ApprovalWorkflowRequest request(Set<Long> roleIds, int minimumApprovers) {
        return new ApprovalWorkflowRequest(
                "Purchase approval",
                ModuleType.PURCHASE,
                "SUBMIT",
                ApprovalMode.SEQUENTIAL,
                minimumApprovers,
                roleIds,
                true,
                null
        );
    }
}
