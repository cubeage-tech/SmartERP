package com.cubeage.erp.reports.mapper;

import com.cubeage.erp.reports.dto.schedule.ReportScheduleResponse;
import com.cubeage.erp.reports.entity.ReportSchedule;
import org.springframework.stereotype.Component;

@Component
public class ReportScheduleMapper {

    public ReportScheduleResponse toResponse(ReportSchedule entity) {
        if (entity == null) return null;

        Long reportId = entity.getIsCustom()
            ? (entity.getCustomReport() != null ? entity.getCustomReport().getId() : null)
            : (entity.getReport() != null ? entity.getReport().getId() : null);

        String reportName = entity.getIsCustom()
            ? (entity.getCustomReport() != null ? entity.getCustomReport().getName() : "")
            : (entity.getReport() != null ? entity.getReport().getName() : "");

        return new ReportScheduleResponse(
            entity.getId(),
            entity.getTenantId(),
            reportId,
            entity.getIsCustom(),
            reportName,
            entity.getFrequency(),
            entity.getDayOfWeek(),
            entity.getTimeOfDay(),
            entity.getRecipients(),
            entity.getFormat(),
            entity.getStartDate(),
            entity.getEndDate(),
            entity.getActive(),
            entity.getCreatedAt()
        );
    }
}
