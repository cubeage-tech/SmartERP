package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.subscription.*;
import com.cubeage.erp.tenant.entity.*;
import com.cubeage.erp.tenant.mapper.TenantSubscriptionMapper;
import com.cubeage.erp.tenant.repository.TenantSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class TenantSubscriptionService {
    private final TenantSubscriptionRepository repository;
    private final TenantService tenantService;
    private final TenantSubscriptionMapper mapper;
    public TenantSubscriptionResponse subscribe(Long tenantId, TenantSubscriptionRequest request) {
        if (!request.endsAt().isAfter(request.startsAt())) throw new IllegalArgumentException("Subscription end must be after start");
        Tenant tenant = tenantService.requireAccessible(tenantId);
        repository.findFirstByTenantIdAndActiveTrueOrderByCreatedAtDesc(tenantId).ifPresent(current -> {
            current.setActive(false); repository.save(current);
        });
        TenantSubscription subscription = TenantSubscription.builder().tenantId(tenantId).plan(request.plan())
                .amount(request.amount()).currency(request.currency().toUpperCase()).startsAt(request.startsAt())
                .endsAt(request.endsAt()).autoRenew(request.autoRenew()).active(true).build();
        tenant.setPlan(request.plan());
        return mapper.toResponse(repository.save(subscription));
    }
    @Transactional(readOnly = true)
    public TenantSubscriptionResponse current(Long tenantId) { tenantService.requireAccessible(tenantId); return repository
            .findFirstByTenantIdAndActiveTrueOrderByCreatedAtDesc(tenantId).map(mapper::toResponse)
            .orElseThrow(() -> new IllegalArgumentException("Active subscription not found")); }
    @Transactional(readOnly = true)
    public List<TenantSubscriptionResponse> history(Long tenantId) { tenantService.requireAccessible(tenantId);
        return repository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream().map(mapper::toResponse).toList(); }
}
