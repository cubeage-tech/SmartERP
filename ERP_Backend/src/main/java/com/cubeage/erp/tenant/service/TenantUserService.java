package com.cubeage.erp.tenant.service;

import com.cubeage.erp.admin.entity.User;
import com.cubeage.erp.admin.repository.UserRepository;
import com.cubeage.erp.tenant.dto.user.*;
import com.cubeage.erp.tenant.entity.*;
import com.cubeage.erp.tenant.enums.TenantUserStatus;
import com.cubeage.erp.tenant.exception.TenantLimitExceededException;
import com.cubeage.erp.tenant.mapper.TenantUserMapper;
import com.cubeage.erp.tenant.repository.TenantUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class TenantUserService {
    private final TenantUserRepository repository;
    private final UserRepository userRepository;
    private final TenantService tenantService;
    private final TenantUserMapper mapper;
    public TenantUserResponse assign(Long tenantId, AssignTenantUserRequest request) {
        Tenant tenant = tenantService.requireAccessible(tenantId);
        User user = requireUser(tenantId, request.userId());
        TenantUser membership = repository.findByTenantIdAndUserId(tenantId, request.userId()).orElse(null);
        if (membership == null) {
            long current = repository.countByTenantIdAndStatus(tenantId, TenantUserStatus.ACTIVE);
            TenantUserStatus requested = request.status() == null ? TenantUserStatus.ACTIVE : request.status();
            if (requested == TenantUserStatus.ACTIVE && current >= tenant.getMaxUsers())
                throw new TenantLimitExceededException("Tenant user limit has been reached");
            membership = TenantUser.builder().tenantId(tenantId).userId(request.userId()).status(requested)
                    .owner(request.owner()).build();
        } else {
            membership.setStatus(request.status() == null ? membership.getStatus() : request.status());
            membership.setOwner(request.owner());
        }
        return mapper.toResponse(repository.save(membership), user);
    }
    @Transactional(readOnly = true)
    public List<TenantUserResponse> list(Long tenantId) { tenantService.requireAccessible(tenantId); return repository
            .findByTenantIdOrderByJoinedAtDesc(tenantId).stream().map(m -> mapper.toResponse(m, requireUser(tenantId, m.getUserId()))).toList(); }
    public void remove(Long tenantId, Long userId) { tenantService.requireAccessible(tenantId); TenantUser membership = repository.findByTenantIdAndUserId(tenantId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Tenant user not found"));
        membership.setStatus(TenantUserStatus.REMOVED); repository.save(membership); }
    private User requireUser(Long tenantId, Long userId) { return userRepository.findById(userId)
            .filter(user -> user.getTenantId().equals(tenantId))
            .orElseThrow(() -> new IllegalArgumentException("User does not belong to tenant")); }
}
