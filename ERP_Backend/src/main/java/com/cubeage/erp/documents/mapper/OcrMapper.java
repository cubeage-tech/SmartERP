package com.cubeage.erp.documents.mapper;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.entity.OcrExtraction;
import org.springframework.stereotype.Component;

@Component
public class OcrMapper {

    public OcrExtractionResponse toResponse(OcrExtraction extraction) {
        return new OcrExtractionResponse(
                extraction.getId(),
                extraction.getDocument().getId(),
                extraction.getDocument().getTitle(),
                extraction.getStatus() == null ? null : extraction.getStatus().name().toLowerCase(),
                extraction.getConfidence(),
                extraction.getVendorName(),
                extraction.getInvoiceNumber(),
                extraction.getInvoiceDate(),
                extraction.getAmount(),
                extraction.getGstin(),
                extraction.getHsnCode(),
                extraction.getAutoPostedToGl(),
                extraction.getManualReviewRequired(),
                extraction.getProcessedAt()
        );
    }
}