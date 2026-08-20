package com.cubeage.erp.projects.event;
public record TaskAtRiskEvent(Long tenantId, Long projectId, Long taskId, String taskTitle, String reason) {}
