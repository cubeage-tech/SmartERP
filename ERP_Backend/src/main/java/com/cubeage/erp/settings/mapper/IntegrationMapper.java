package com.cubeage.erp.settings.mapper;
import com.cubeage.erp.settings.dto.integration.IntegrationResponse;
import com.cubeage.erp.settings.entity.IntegrationSetting;
import org.springframework.stereotype.Component;
@Component
public class IntegrationMapper { public IntegrationResponse toResponse(IntegrationSetting s) { return new IntegrationResponse(s.getId(),s.getType(),s.getName(),s.getStatus(),Boolean.TRUE.equals(s.getEnabled()),s.getLastCheckedAt(),s.getLastError(),s.getUpdatedAt()); } }
