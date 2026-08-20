package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.SuperAdminAuditLog;
import com.cubeage.erp.superAdmin.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface SuperAdminAuditLogRepository extends JpaRepository<SuperAdminAuditLog, Long> {
    Page<SuperAdminAuditLog> findByPerformedBy(Long userId, Pageable pageable);
    Page<SuperAdminAuditLog> findByTargetTenantId(Long tenantId, Pageable pageable);
    List<SuperAdminAuditLog> findByActionAndCreatedAtBetween(AuditAction action, Instant from, Instant to);
    Page<SuperAdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
