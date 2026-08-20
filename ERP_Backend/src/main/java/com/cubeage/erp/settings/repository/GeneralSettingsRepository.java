package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.GeneralSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface GeneralSettingsRepository extends JpaRepository<GeneralSettings, Long> { Optional<GeneralSettings> findByTenantId(Long tenantId); }
