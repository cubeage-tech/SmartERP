package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.security.AuditLogResponse;
import com.cubeage.erp.settings.entity.AuditLog;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import com.cubeage.erp.settings.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository repository; private final SettingsMapper mapper;
    @Transactional public void record(Long tenantId,Long actorId,String action,String module,String entityType,String entityId,String details,String ipAddress) { repository.save(AuditLog.builder().tenantId(tenantId).actorUserId(actorId).action(action).module(module).entityType(entityType).entityId(entityId).details(details).ipAddress(ipAddress).build()); }
    @Transactional(readOnly=true) public Page<AuditLogResponse> list(Long tenantId,int page,int size) { return repository.findByTenantId(tenantId,PageRequest.of(page,Math.min(Math.max(size,1),100),Sort.by(Sort.Direction.DESC,"createdAt"))).map(mapper::audit); }
}
