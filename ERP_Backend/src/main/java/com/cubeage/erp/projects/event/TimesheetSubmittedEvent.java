package com.cubeage.erp.projects.event;
public record TimesheetSubmittedEvent(Long tenantId, Long timesheetId, Long projectId, Long userId) {}
