package com.cubeage.erp.superAdmin.service;

import com.cubeage.erp.superAdmin.dto.audit.AuditLogResponse;
import com.cubeage.erp.superAdmin.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    Page<AuditLogResponse> getAll(Pageable pageable);
    Page<AuditLogResponse> getByTenant(Long tenantId, Pageable pageable);
    Page<AuditLogResponse> getByUser(Long userId, Pageable pageable);
    void log(Long performedBy, Long targetTenantId, String entityType, Long entityId,
             AuditAction action, String description, String oldValue, String newValue,
             String ipAddress, String userAgent);
}
