package com.cubeage.erp.settings.dto.module;
import com.cubeage.erp.settings.enums.ModuleType;
import jakarta.validation.constraints.NotNull;
public record ModuleSettingRequest(@NotNull ModuleType module, boolean enabled, String configJson) { }
