package com.cubeage.erp.reports.dto.custom;

import java.util.List;
import java.util.Map;

public record PreviewDataResponse(
    List<String> columns,
    List<Map<String, Object>> data,
    long recordCount
) {}
