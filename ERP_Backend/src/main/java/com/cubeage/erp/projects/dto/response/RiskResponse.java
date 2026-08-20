package com.cubeage.erp.projects.dto.response;
public record RiskResponse(Long id,Long projectId,Long taskId,String title,String description,String type,String level,String status,
 Integer probabilityPercent,Integer impactScore,String mitigationPlan,Long ownerUserId,String ownerName,Boolean aiGenerated) {}
