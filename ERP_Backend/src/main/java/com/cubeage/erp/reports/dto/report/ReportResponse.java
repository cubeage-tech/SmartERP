package com.cubeage.erp.reports.dto.report;

import com.cubeage.erp.reports.enums.ReportCategory;
import com.cubeage.erp.reports.enums.ReportFrequency;
import com.cubeage.erp.reports.enums.ReportStatus;
import java.time.LocalDateTime;

public record ReportResponse(
    Long id,
    String name,
    ReportCategory category,
    String format,
    LocalDateTime lastRun,
    ReportFrequency schedule,
    ReportStatus status,
    boolean isCustom
) {}
