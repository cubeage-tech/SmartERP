package com.cubeage.erp.tenant.service;

import com.cubeage.erp.tenant.dto.tenant.*;
import com.cubeage.erp.tenant.entity.Tenant;
import com.cubeage.erp.tenant.enums.*;
import com.cubeage.erp.tenant.exception.TenantNotFoundException;
import com.cubeage.erp.tenant.mapper.TenantMapper;
import com.cubeage.erp.tenant.repository.*;
import com.cubeage.erp.security.SecurityUtils;
import com.cubeage.erp.tenant.exception.TenantAccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

@Service @RequiredArgsConstructor @Transactional
public class TenantService {
    private final TenantRepository tenantRepository;
    private final TenantUserRepository tenantUserRepository;
    private final TenantMapper mapper;

    public TenantResponse create(CreateTenantRequest request) {
        String code = request.code().trim().toLowerCase(Locale.ROOT);
        if (tenantRepository.existsByCodeIgnoreCase(code)) throw new IllegalArgumentException("Tenant code already exists");
        Tenant tenant = Tenant.builder().code(code).name(request.name().trim())
                .contactEmail(request.contactEmail().trim().toLowerCase(Locale.ROOT)).contactPhone(request.contactPhone())
                .status(TenantStatus.TRIAL).plan(request.plan())
                .maxUsers(request.maxUsers() == null ? 10 : request.maxUsers())
                .currency(request.currency() == null ? "INR" : request.currency().toUpperCase(Locale.ROOT))
                .timezone(request.timezone() == null ? "Asia/Kolkata" : request.timezone())
                .trialEndsAt(Instant.now().plus(14, ChronoUnit.DAYS)).build();
        return mapper.toResponse(tenantRepository.save(tenant));
    }

    @Transactional(readOnly = true)
    public List<TenantSummaryResponse> list(TenantStatus status) {
        List<Tenant> tenants = status == null ? tenantRepository.findAll() : tenantRepository.findByStatusOrderByCreatedAtDesc(status);
        return tenants.stream().map(t -> mapper.toSummary(t,
                tenantUserRepository.countByTenantIdAndStatus(t.getId(), TenantUserStatus.ACTIVE))).toList();
    }

    @Transactional(readOnly = true)
    public TenantResponse get(Long id) { return mapper.toResponse(require(id)); }

    public TenantResponse update(Long id, UpdateTenantRequest request) {
        Tenant tenant = require(id);
        if (request.name() != null) tenant.setName(request.name().trim());
        if (request.contactEmail() != null) tenant.setContactEmail(request.contactEmail().trim().toLowerCase(Locale.ROOT));
        if (request.contactPhone() != null) tenant.setContactPhone(request.contactPhone());
        if (request.status() != null) tenant.setStatus(request.status());
        if (request.plan() != null) tenant.setPlan(request.plan());
        if (request.maxUsers() != null) tenant.setMaxUsers(request.maxUsers());
        if (request.currency() != null) tenant.setCurrency(request.currency().toUpperCase(Locale.ROOT));
        if (request.timezone() != null) tenant.setTimezone(request.timezone());
        return mapper.toResponse(tenantRepository.save(tenant));
    }

    public void delete(Long id) { Tenant tenant = require(id); tenant.setStatus(TenantStatus.INACTIVE); tenantRepository.save(tenant); }

    @Transactional(readOnly = true)
    public Tenant require(Long id) {
        return tenantRepository.findById(id).orElseThrow(() -> new TenantNotFoundException("Tenant not found: " + id));
    }

    @Transactional(readOnly = true)
    public Tenant requireAccessible(Long id) {
        if (!SecurityUtils.hasRole("SUPER_ADMIN") && !SecurityUtils.currentTenantId().equals(id)) {
            throw new TenantAccessDeniedException("Tenant access denied");
        }
        return require(id);
    }
}
