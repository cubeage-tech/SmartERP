package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.IntegrationSetting;
import com.cubeage.erp.settings.enums.IntegrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface IntegrationSettingRepository extends JpaRepository<IntegrationSetting, Long> {
    List<IntegrationSetting> findByTenantIdOrderByName(Long tenantId);
    Optional<IntegrationSetting> findByIdAndTenantId(Long id, Long tenantId);
    long countByTenantIdAndStatus(Long tenantId, IntegrationStatus status);
}
