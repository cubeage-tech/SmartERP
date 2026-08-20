package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.SecuritySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface SecuritySettingRepository extends JpaRepository<SecuritySetting, Long> { Optional<SecuritySetting> findByTenantId(Long tenantId); }
