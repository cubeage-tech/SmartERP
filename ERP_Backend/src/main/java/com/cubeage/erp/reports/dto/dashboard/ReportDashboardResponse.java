package com.cubeage.erp.reports.dto.dashboard;

import com.cubeage.erp.reports.dto.report.ReportResponse;
import java.util.List;
import java.util.Map;

public record ReportDashboardResponse(
    Map<String, List<KpiResponse>> kpiData,
    List<RevenueTrendResponse> revenueTrend,
    List<RevenueSplitResponse> revenueSplit,
    List<ReportResponse> reportsList
) {}
