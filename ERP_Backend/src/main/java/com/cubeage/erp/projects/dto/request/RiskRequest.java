package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.*; import jakarta.validation.constraints.*;
public record RiskRequest(Long taskId,@NotBlank String title,String description,@NotNull RiskType type,
 @NotNull RiskLevel level,@Min(0) @Max(100) int probabilityPercent,@Min(1) @Max(5) int impactScore,
 String mitigationPlan,Long ownerUserId,String ownerName) {}
