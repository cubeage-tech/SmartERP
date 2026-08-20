package com.cubeage.erp.documents.dto.ocr;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OcrExtractionResponse(
        Long id,
        Long documentId,
        String documentTitle,
        String status,
        Double confidence,
        String vendorName,
        String invoiceNumber,
        String invoiceDate,
        BigDecimal amount,
        String gstin,
        String hsnCode,
        Boolean autoPostedToGl,
        Boolean manualReviewRequired,
        LocalDateTime processedAt
) {
}
