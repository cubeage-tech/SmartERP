package com.cubeage.erp.reports.dto.export;

import com.cubeage.erp.reports.enums.ReportFormat;
import jakarta.validation.constraints.NotNull;

public record ReportExportRequest(
    @NotNull(message = "Format is required")
    ReportFormat format,
    boolean isCustom
) {}
