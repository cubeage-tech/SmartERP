package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.module.*;
import com.cubeage.erp.settings.entity.ModuleSetting;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import com.cubeage.erp.settings.repository.ModuleSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class ModuleSettingsService {
    private final ModuleSettingRepository repository; private final SettingsMapper mapper;
    @Transactional(readOnly=true) public List<ModuleSettingResponse> list(Long tenantId) { return repository.findByTenantIdOrderByModule(tenantId).stream().map(mapper::module).toList(); }
    public ModuleSettingResponse update(Long tenantId,ModuleSettingRequest r) { ModuleSetting s=repository.findByTenantIdAndModule(tenantId,r.module()).orElseGet(() -> ModuleSetting.builder().tenantId(tenantId).module(r.module()).build());s.setEnabled(r.enabled());s.setConfigJson(r.configJson());return mapper.module(repository.save(s)); }
}
