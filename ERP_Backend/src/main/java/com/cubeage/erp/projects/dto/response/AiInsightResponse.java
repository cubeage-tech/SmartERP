package com.cubeage.erp.projects.dto.response;
public record AiInsightResponse(Long id,Long projectId,String type,Integer score,String summary,
 String contributingFactors,String recommendation,Boolean active) {}
