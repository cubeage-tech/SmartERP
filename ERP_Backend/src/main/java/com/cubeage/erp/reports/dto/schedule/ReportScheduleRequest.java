package com.cubeage.erp.reports.dto.schedule;

import com.cubeage.erp.reports.enums.ReportFormat;
import com.cubeage.erp.reports.enums.ReportFrequency;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ReportScheduleRequest(
    @NotNull(message = "Report ID is required")
    Long reportId,

    boolean isCustom,

    @NotNull(message = "Frequency is required")
    ReportFrequency frequency,

    String dayOfWeek,

    @NotBlank(message = "Execution time is required")
    @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Execution time must be in HH:mm format")
    String timeOfDay,

    @NotBlank(message = "Recipients are required")
    String recipients,

    @NotNull(message = "Export format is required")
    ReportFormat format,

    @NotNull(message = "Start date is required")
    LocalDate startDate,

    LocalDate endDate,

    @NotNull(message = "Active status is required")
    Boolean active
) {}
