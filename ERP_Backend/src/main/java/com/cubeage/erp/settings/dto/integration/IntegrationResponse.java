package com.cubeage.erp.settings.dto.integration;
import com.cubeage.erp.settings.enums.*;
import java.time.Instant;
public record IntegrationResponse(Long id, IntegrationType type, String name, IntegrationStatus status,
                                  boolean enabled, Instant lastCheckedAt, String lastError, Instant updatedAt) { }
