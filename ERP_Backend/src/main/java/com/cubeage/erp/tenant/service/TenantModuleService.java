package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.module.*;
import com.cubeage.erp.tenant.entity.TenantModule;
import com.cubeage.erp.tenant.repository.TenantModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Locale;

@Service @RequiredArgsConstructor @Transactional
public class TenantModuleService {
    private final TenantModuleRepository repository;
    private final TenantService tenantService;
    public TenantModuleResponse configure(Long tenantId, TenantModuleRequest request) {
        tenantService.requireAccessible(tenantId);
        String key = request.moduleKey().trim().toUpperCase(Locale.ROOT);
        TenantModule module = repository.findByTenantIdAndModuleKeyIgnoreCase(tenantId, key)
                .orElseGet(() -> TenantModule.builder().tenantId(tenantId).moduleKey(key).build());
        module.setStatus(request.status()); module.setExpiresAt(request.expiresAt());
        return map(repository.save(module));
    }
    @Transactional(readOnly = true)
    public List<TenantModuleResponse> list(Long tenantId) { tenantService.requireAccessible(tenantId);
        return repository.findByTenantIdOrderByModuleKey(tenantId).stream().map(this::map).toList(); }
    private TenantModuleResponse map(TenantModule m) { return new TenantModuleResponse(m.getId(), m.getTenantId(),
            m.getModuleKey(), m.getStatus(), m.getExpiresAt(), m.getUpdatedAt()); }
}
