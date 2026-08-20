package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.NotificationPreference;
import com.cubeage.erp.settings.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    List<NotificationPreference> findByTenantIdAndUserIdOrderByType(Long tenantId, Long userId);
    Optional<NotificationPreference> findByTenantIdAndUserIdAndType(Long tenantId, Long userId, NotificationType type);
}
