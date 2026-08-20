package com.cubeage.erp.settings.dto.integration;
import com.cubeage.erp.settings.enums.IntegrationStatus;
import java.time.Instant;
public record IntegrationStatusResponse(Long id, IntegrationStatus status, Instant checkedAt, String message) { }
