package com.cubeage.erp.reports.dto.custom;

import com.cubeage.erp.reports.enums.ReportCategory;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record CustomReportRequest(
    @NotBlank(message = "Report name is required")
    @Size(max = 255)
    String name,

    @NotNull(message = "Module is required")
    ReportCategory module,

    @NotBlank(message = "Report type is required")
    String reportType,

    String description,

    @NotBlank(message = "Visibility is required")
    String visibility,

    @NotBlank(message = "Data source is required")
    String dataSource,

    @NotBlank(message = "Primary table is required")
    String primaryTable,

    List<String> selectedFields,

    List<FilterRow> filters,

    String matchType,

    String dateField,

    String dateRange,

    LocalDate fromDate,

    LocalDate toDate,

    List<String> groupBy,

    String sortBy,

    String sortDir,

    List<CalculationRow> calculations,

    @NotBlank(message = "Visualization type is required")
    String vizType,

    boolean kpiEnabled,

    List<KpiRow> kpis,

    boolean schedEnabled,

    ExportFormatSettings exportFormats,

    ExportIncludeSettings exportIncludes,

    List<String> sharedUsers
) {
    public record FilterRow(String field, String operator, String value) {}
    public record CalculationRow(String field, String calc, String alias) {}
    public record KpiRow(String name, String metric, String calc, String target, String unit) {}
    public record ExportFormatSettings(boolean pdf, boolean excel, boolean csv) {}
    public record ExportIncludeSettings(boolean logo, boolean dateRange, boolean summary, boolean charts, boolean filters, boolean pageNumbers) {}
}
