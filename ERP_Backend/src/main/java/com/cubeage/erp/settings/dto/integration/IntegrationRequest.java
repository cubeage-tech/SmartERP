package com.cubeage.erp.settings.dto.integration;
import com.cubeage.erp.settings.enums.IntegrationType;
import jakarta.validation.constraints.*;
public record IntegrationRequest(@NotNull IntegrationType type, @NotBlank String name,
                                 String configJson, boolean enabled) { }
