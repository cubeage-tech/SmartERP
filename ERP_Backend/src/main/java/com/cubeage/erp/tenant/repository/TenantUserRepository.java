package com.cubeage.erp.tenant.repository;

import com.cubeage.erp.tenant.entity.TenantUser;
import com.cubeage.erp.tenant.enums.TenantUserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TenantUserRepository extends JpaRepository<TenantUser, Long> {
    List<TenantUser> findByTenantIdOrderByJoinedAtDesc(Long tenantId);
    Optional<TenantUser> findByTenantIdAndUserId(Long tenantId, Long userId);
    long countByTenantIdAndStatus(Long tenantId, TenantUserStatus status);
    long countByStatus(TenantUserStatus status);
}
