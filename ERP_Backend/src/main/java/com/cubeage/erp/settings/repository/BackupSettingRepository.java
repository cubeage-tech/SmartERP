package com.cubeage.erp.settings.repository;

import com.cubeage.erp.settings.entity.BackupSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BackupSettingRepository extends JpaRepository<BackupSetting, Long> {
    Optional<BackupSetting> findByTenantId(Long tenantId);
}
