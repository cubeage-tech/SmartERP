package com.cubeage.erp.reports.mapper;

import com.cubeage.erp.reports.dto.report.ReportResponse;
import com.cubeage.erp.reports.entity.Report;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toResponse(Report entity) {
        if (entity == null) return null;

        return new ReportResponse(
            entity.getId(),
            entity.getName(),
            entity.getCategory(),
            entity.getFormat(),
            entity.getLastRun(),
            entity.getSchedule(),
            entity.getStatus(),
            false
        );
    }
}
