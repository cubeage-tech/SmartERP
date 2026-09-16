package com.cubeage.erp.reports.mapper;

import com.cubeage.erp.reports.dto.custom.CustomReportRequest;
import com.cubeage.erp.reports.dto.custom.CustomReportResponse;
import com.cubeage.erp.reports.entity.CustomReport;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CustomReportMapper {

    private final ObjectMapper objectMapper;

    public CustomReportResponse toResponse(CustomReport entity) {
        if (entity == null) return null;

        return new CustomReportResponse(
            entity.getId(),
            entity.getName(),
            entity.getModule(),
            entity.getReportType(),
            entity.getDescription(),
            entity.getVisibility(),
            entity.getCreatedBy(),
            entity.getCreatedAt(),
            entity.getDataSource(),
            entity.getPrimaryTable(),
            deserializeList(entity.getSelectedFieldsJson(), new TypeReference<List<String>>() {}),
            deserializeList(entity.getFiltersJson(), new TypeReference<List<CustomReportRequest.FilterRow>>() {}),
            entity.getMatchType(),
            entity.getDateField(),
            entity.getDateRange(),
            entity.getFromDate(),
            entity.getToDate(),
            deserializeList(entity.getGroupByJson(), new TypeReference<List<String>>() {}),
            entity.getSortBy(),
            entity.getSortDir(),
            deserializeList(entity.getCalculationsJson(), new TypeReference<List<CustomReportRequest.CalculationRow>>() {}),
            entity.getVizType(),
            entity.getKpiEnabled(),
            deserializeList(entity.getKpisJson(), new TypeReference<List<CustomReportRequest.KpiRow>>() {}),
            entity.getSchedEnabled(),
            deserializeObject(entity.getExportFormatsJson(), CustomReportRequest.ExportFormatSettings.class),
            deserializeObject(entity.getExportIncludesJson(), CustomReportRequest.ExportIncludeSettings.class),
            deserializeList(entity.getSharedUsersJson(), new TypeReference<List<String>>() {}),
            entity.getStatus()
        );
    }

    public String serialize(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return null;
        }
    }

    private <T> List<T> deserializeList(String json, TypeReference<List<T>> typeReference) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private <T> T deserializeObject(String json, Class<T> clazz) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            return null;
        }
    }
}
