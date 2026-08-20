package com.cubeage.erp.projects.event;
public record TaskAssignedEvent(Long tenantId, Long projectId, Long taskId, Long assignedToUserId, String taskTitle) {}
