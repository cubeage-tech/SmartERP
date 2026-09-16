package com.cubeage.erp.reports.service;

import com.cubeage.erp.reports.dto.custom.CustomReportRequest;
import com.cubeage.erp.reports.dto.custom.CustomReportResponse;
import com.cubeage.erp.reports.dto.custom.PreviewDataResponse;
import java.util.List;

public interface CustomReportService {
    CustomReportResponse create(Long tenantId, CustomReportRequest request);
    CustomReportResponse update(Long tenantId, Long id, CustomReportRequest request);
    CustomReportResponse get(Long tenantId, Long id);
    List<CustomReportResponse> all(Long tenantId);
    void delete(Long tenantId, Long id);
    PreviewDataResponse getPreview(Long tenantId, Long id);
    PreviewDataResponse getPreviewDynamic(Long tenantId, CustomReportRequest request);
}
