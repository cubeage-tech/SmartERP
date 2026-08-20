package com.cubeage.erp.projects.event;
public record ProjectCreatedEvent(Long tenantId, Long projectId, String projectCode, String projectName) {}
