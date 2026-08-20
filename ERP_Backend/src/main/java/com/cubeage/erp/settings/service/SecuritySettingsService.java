package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.security.*;
import com.cubeage.erp.settings.entity.SecuritySetting;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import com.cubeage.erp.settings.repository.SecuritySettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor @Transactional
public class SecuritySettingsService {
    private final SecuritySettingRepository repository; private final SettingsMapper mapper;
    @Transactional(readOnly=true) public SecuritySettingsResponse get(Long tenantId) { return mapper.security(repository.findByTenantId(tenantId).orElseGet(() -> defaults(tenantId))); }
    public SecuritySettingsResponse update(Long tenantId,SecuritySettingsRequest r) { SecuritySetting s=repository.findByTenantId(tenantId).orElseGet(() -> defaults(tenantId));s.setMfaRequired(r.mfaRequired());s.setMinimumPasswordLength(r.minimumPasswordLength());s.setPasswordExpiryDays(r.passwordExpiryDays());s.setMaxLoginAttempts(r.maxLoginAttempts());s.setSessionTimeoutMinutes(r.sessionTimeoutMinutes());s.setIpRestrictionEnabled(r.ipRestrictionEnabled());return mapper.security(repository.save(s)); }
    private SecuritySetting defaults(Long tenantId) { return SecuritySetting.builder().tenantId(tenantId).mfaRequired(false).minimumPasswordLength(10).passwordExpiryDays(90).maxLoginAttempts(5).sessionTimeoutMinutes(30).ipRestrictionEnabled(false).build(); }
}
