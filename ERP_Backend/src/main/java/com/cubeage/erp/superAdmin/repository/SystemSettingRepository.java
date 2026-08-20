package com.cubeage.erp.superAdmin.repository;

import com.cubeage.erp.superAdmin.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findByKey(String key);
    List<SystemSetting> findByCategory(String category);
    boolean existsByKey(String key);
}
