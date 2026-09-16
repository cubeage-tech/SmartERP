package com.cubeage.erp.reports.dto.report;

import com.cubeage.erp.reports.enums.ReportCategory;
import com.cubeage.erp.reports.enums.ReportFrequency;
import com.cubeage.erp.reports.enums.ReportStatus;

public record ReportRequest(
    String name,
    ReportCategory category,
    String format,
    ReportFrequency schedule,
    ReportStatus status
) {}
