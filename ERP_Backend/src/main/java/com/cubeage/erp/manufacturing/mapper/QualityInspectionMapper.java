package com.cubeage.erp.manufacturing.mapper;

import com.cubeage.erp.manufacturing.dto.response.QualityInspectionResponse;
import com.cubeage.erp.manufacturing.dto.response.RejectionResponse;
import com.cubeage.erp.manufacturing.entity.QualityInspection;
import org.springframework.stereotype.Component;

@Component
public class QualityInspectionMapper {

    public QualityInspectionResponse toResponse(QualityInspection inspection) {
        return new QualityInspectionResponse(
                inspection.getId(),
                inspection.getWorkOrderNumber(),
                inspection.getProductName(),
                inspection.getType(),
                inspection.getResult(),
                inspection.getQuantity(),
                inspection.getReason(),
                inspection.getInspectorName(),
                inspection.getCreatedAt()
        );
    }

    public RejectionResponse toRejectionResponse(QualityInspection inspection) {
        return new RejectionResponse(
                inspection.getId(),
                inspection.getProductName(),
                inspection.getWorkOrderNumber(),
                inspection.getReason() != null ? inspection.getReason() : "Quality deviation",
                inspection.getQuantity() + " pcs"
        );
    }
}