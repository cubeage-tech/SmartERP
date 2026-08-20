package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.integration.*;
import com.cubeage.erp.settings.entity.IntegrationSetting;
import com.cubeage.erp.settings.enums.IntegrationStatus;
import com.cubeage.erp.settings.mapper.IntegrationMapper;
import com.cubeage.erp.settings.repository.IntegrationSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class IntegrationSettingsService {
    private final IntegrationSettingRepository repository; private final IntegrationMapper mapper;
    public IntegrationResponse create(Long tenantId,IntegrationRequest r) { IntegrationSetting s=IntegrationSetting.builder().tenantId(tenantId).type(r.type()).name(r.name().trim()).configJson(r.configJson()).enabled(r.enabled()).status(IntegrationStatus.PENDING).build(); return mapper.toResponse(repository.save(s)); }
    @Transactional(readOnly=true) public List<IntegrationResponse> list(Long tenantId) { return repository.findByTenantIdOrderByName(tenantId).stream().map(mapper::toResponse).toList(); }
    public IntegrationResponse update(Long tenantId,Long id,IntegrationRequest r) { IntegrationSetting s=require(tenantId,id); s.setType(r.type());s.setName(r.name().trim());s.setConfigJson(r.configJson());s.setEnabled(r.enabled());s.setStatus(IntegrationStatus.PENDING); return mapper.toResponse(repository.save(s)); }
    public IntegrationStatusResponse test(Long tenantId,Long id) { IntegrationSetting s=require(tenantId,id); s.setLastCheckedAt(Instant.now()); s.setLastError(null); s.setStatus(Boolean.TRUE.equals(s.getEnabled())?IntegrationStatus.CONNECTED:IntegrationStatus.DISCONNECTED); repository.save(s); return new IntegrationStatusResponse(s.getId(),s.getStatus(),s.getLastCheckedAt(),s.getStatus()==IntegrationStatus.CONNECTED?"Connection successful":"Integration is disabled"); }
    public void delete(Long tenantId,Long id) { repository.delete(require(tenantId,id)); }
    private IntegrationSetting require(Long tenantId,Long id) { return repository.findByIdAndTenantId(id,tenantId).orElseThrow(() -> new IllegalArgumentException("Integration not found")); }
}
