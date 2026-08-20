package com.cubeage.erp.settings.service;
import com.cubeage.erp.settings.dto.notification.*;
import com.cubeage.erp.settings.entity.NotificationPreference;
import com.cubeage.erp.settings.mapper.SettingsMapper;
import com.cubeage.erp.settings.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class NotificationSettingsService {
    private final NotificationPreferenceRepository repository; private final SettingsMapper mapper;
    @Transactional(readOnly=true) public List<NotificationPreferenceResponse> list(Long tenantId,Long userId) { return repository.findByTenantIdAndUserIdOrderByType(tenantId,userId).stream().map(mapper::notification).toList(); }
    public NotificationPreferenceResponse update(Long tenantId,Long userId,NotificationPreferenceRequest r) {
        NotificationPreference p=repository.findByTenantIdAndUserIdAndType(tenantId,userId,r.type()).orElseGet(() -> NotificationPreference.builder().tenantId(tenantId).userId(userId).type(r.type()).build());
        p.setEmailEnabled(r.emailEnabled()); p.setInAppEnabled(r.inAppEnabled()); p.setSmsEnabled(r.smsEnabled()); return mapper.notification(repository.save(p));
    }
}
