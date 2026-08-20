package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.domain.*;
import com.cubeage.erp.tenant.entity.TenantDomain;
import com.cubeage.erp.tenant.repository.TenantDomainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service @RequiredArgsConstructor @Transactional
public class TenantDomainService {
    private final TenantDomainRepository repository;
    private final TenantService tenantService;
    public TenantDomainResponse add(Long tenantId, TenantDomainRequest request) {
        tenantService.requireAccessible(tenantId);
        String domain = request.domain().trim().toLowerCase(Locale.ROOT);
        if (repository.existsByDomainIgnoreCase(domain)) throw new IllegalArgumentException("Domain is already registered");
        if (request.primaryDomain()) clearPrimary(tenantId);
        return map(repository.save(TenantDomain.builder().tenantId(tenantId).domain(domain)
                .primaryDomain(request.primaryDomain()).verified(false).build()));
    }
    @Transactional(readOnly = true)
    public List<TenantDomainResponse> list(Long tenantId) { tenantService.requireAccessible(tenantId); return repository
            .findByTenantIdOrderByPrimaryDomainDesc(tenantId).stream().map(this::map).toList(); }
    public TenantDomainResponse verify(Long tenantId, Long id) {
        tenantService.requireAccessible(tenantId);
        TenantDomain domain = require(tenantId, id); domain.setVerified(true); domain.setVerifiedAt(Instant.now());
        return map(repository.save(domain));
    }
    public void remove(Long tenantId, Long id) { tenantService.requireAccessible(tenantId); repository.delete(require(tenantId, id)); }
    private TenantDomain require(Long tenantId, Long id) { return repository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new IllegalArgumentException("Tenant domain not found")); }
    private void clearPrimary(Long tenantId) { List<TenantDomain> domains = repository.findByTenantIdOrderByPrimaryDomainDesc(tenantId);
        domains.forEach(d -> d.setPrimaryDomain(false)); repository.saveAll(domains); }
    private TenantDomainResponse map(TenantDomain d) { return new TenantDomainResponse(d.getId(), d.getTenantId(), d.getDomain(),
            Boolean.TRUE.equals(d.getPrimaryDomain()), Boolean.TRUE.equals(d.getVerified()), d.getVerifiedAt(), d.getCreatedAt()); }
}
