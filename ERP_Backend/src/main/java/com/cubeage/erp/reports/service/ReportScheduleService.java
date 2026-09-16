package com.cubeage.erp.reports.service;

import com.cubeage.erp.reports.dto.schedule.ReportScheduleRequest;
import com.cubeage.erp.reports.dto.schedule.ReportScheduleResponse;
import java.util.List;

public interface ReportScheduleService {
    ReportScheduleResponse create(Long tenantId, ReportScheduleRequest request);
    ReportScheduleResponse update(Long tenantId, Long id, ReportScheduleRequest request);
    ReportScheduleResponse get(Long tenantId, Long id);
    List<ReportScheduleResponse> all(Long tenantId);
    void delete(Long tenantId, Long id);
}
