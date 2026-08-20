package com.cubeage.erp.projects.dto.request;
import jakarta.validation.constraints.*; import java.math.BigDecimal; import java.time.LocalDate;
public record CreateTimesheetRequest(@NotNull Long projectId,@NotNull Long taskId,@NotNull LocalDate workDate,
 @NotNull @DecimalMin("0.01") @DecimalMax("24.00") BigDecimal hours,String description) {}
