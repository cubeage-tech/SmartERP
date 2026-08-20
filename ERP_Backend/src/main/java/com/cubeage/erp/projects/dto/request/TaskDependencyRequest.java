package com.cubeage.erp.projects.dto.request; import jakarta.validation.constraints.NotNull;
public record TaskDependencyRequest(@NotNull Long dependsOnTaskId) {}
