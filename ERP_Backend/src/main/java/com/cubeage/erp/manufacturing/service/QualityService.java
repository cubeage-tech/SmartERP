package com.cubeage.erp.manufacturing.service;

import com.cubeage.erp.manufacturing.dto.request.CreateQualityInspectionRequest;
import com.cubeage.erp.manufacturing.dto.response.QualityInspectionResponse;
import com.cubeage.erp.manufacturing.dto.response.QualitySummaryResponse;

import java.util.List;

public interface QualityService {

    QualityInspectionResponse createInspection(Long tenantId, CreateQualityInspectionRequest request);

    List<QualityInspectionResponse> getInspections(Long tenantId);

    QualitySummaryResponse getQualityControlSummary(Long tenantId);
}