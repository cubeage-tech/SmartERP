package com.cubeage.erp.settings.repository;
import com.cubeage.erp.settings.entity.ModuleSetting;
import com.cubeage.erp.settings.enums.ModuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ModuleSettingRepository extends JpaRepository<ModuleSetting, Long> {
    List<ModuleSetting> findByTenantIdOrderByModule(Long tenantId);
    Optional<ModuleSetting> findByTenantIdAndModule(Long tenantId, ModuleType module);
    long countByTenantIdAndEnabledTrue(Long tenantId);
}
