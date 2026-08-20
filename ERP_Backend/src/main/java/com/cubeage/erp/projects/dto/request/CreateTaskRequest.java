package com.cubeage.erp.projects.dto.request;
import com.cubeage.erp.projects.enums.TaskPriority; import jakarta.validation.constraints.*;
import java.math.BigDecimal; import java.time.LocalDate;
public record CreateTaskRequest(Long milestoneId,Long parentTaskId,@NotBlank String title,String description,
 Long assignedToUserId,String assignedToName,@NotNull LocalDate plannedStartDate,@NotNull LocalDate plannedEndDate,
 @NotNull TaskPriority priority,@NotNull @DecimalMin("0.00") BigDecimal plannedHours) {}
