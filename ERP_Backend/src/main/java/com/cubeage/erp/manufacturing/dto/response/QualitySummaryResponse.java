package com.cubeage.erp.manufacturing.dto.response;

import java.util.List;

public record QualitySummaryResponse(
        Double passRate,
        Double reworkRate,
        Double rejectionRate,
        List<RejectionResponse> recentRejections
) {}