package com.cubeage.erp.projects.dto.response; import java.time.LocalDate;
public record MilestoneResponse(Long id,Long projectId,String name,String description,LocalDate plannedDate,
 LocalDate completedDate,String status,Integer progressPercent) {}
