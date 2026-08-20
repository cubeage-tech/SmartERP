package com.cubeage.erp.projects.event;
import java.time.LocalDate;
public record MilestoneDueEvent(Long tenantId, Long projectId, Long milestoneId, String milestoneName, LocalDate dueDate) {}
