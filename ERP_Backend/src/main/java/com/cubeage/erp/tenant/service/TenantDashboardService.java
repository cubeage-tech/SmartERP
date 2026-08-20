package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.dashboard.TenantDashboardResponse;
import com.cubeage.erp.tenant.enums.*;
import com.cubeage.erp.tenant.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class TenantDashboardService {
    private final TenantRepository tenantRepository;
    private final TenantUserRepository userRepository;
    private final TenantModuleRepository moduleRepository;
    @Transactional(readOnly = true)
    public TenantDashboardResponse platform() {
        return new TenantDashboardResponse(tenantRepository.count(), tenantRepository.countByStatus(TenantStatus.ACTIVE),
                tenantRepository.countByStatus(TenantStatus.TRIAL), tenantRepository.countByStatus(TenantStatus.SUSPENDED),
                userRepository.countByStatus(TenantUserStatus.ACTIVE),
                moduleRepository.findAll().stream().filter(m -> m.getStatus() == TenantModuleStatus.ENABLED).count());
    }
}
