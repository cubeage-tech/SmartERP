package com.cubeage.erp.settings.dto.module;
import com.cubeage.erp.settings.enums.ModuleType;
import java.time.Instant;
public record ModuleSettingResponse(Long id, ModuleType module, boolean enabled, String configJson, Instant updatedAt) { }
