package com.cubeage.erp.projects.dto.response; import java.util.List;
public record GanttResponse(ProjectResponse project,List<MilestoneResponse> milestones,List<TaskResponse> tasks) {}
