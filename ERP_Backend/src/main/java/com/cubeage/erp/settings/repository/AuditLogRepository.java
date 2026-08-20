package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.AuditLog;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByTenantId(Long tenantId, Pageable pageable);
    long countByTenantId(Long tenantId);
}
