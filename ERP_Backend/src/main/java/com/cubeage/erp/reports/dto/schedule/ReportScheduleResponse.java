package com.cubeage.erp.reports.dto.schedule;

import com.cubeage.erp.reports.enums.ReportFormat;
import com.cubeage.erp.reports.enums.ReportFrequency;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReportScheduleResponse(
    Long id,
    Long tenantId,
    Long reportId,
    boolean isCustom,
    String reportName,
    ReportFrequency frequency,
    String dayOfWeek,
    String timeOfDay,
    String recipients,
    ReportFormat format,
    LocalDate startDate,
    LocalDate endDate,
    Boolean active,
    LocalDateTime createdAt
) {}
