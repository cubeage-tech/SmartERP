package com.cubeage.erp.projects.dto.request;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public record CreateMilestoneRequest(@NotBlank String name,String description,@NotNull LocalDate plannedDate) {}
