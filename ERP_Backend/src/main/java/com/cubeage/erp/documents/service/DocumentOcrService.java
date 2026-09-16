package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.dto.ocr.OcrStatsResponse;

import java.util.List;

public interface DocumentOcrService {

    OcrExtractionResponse process(Long tenantId, Long documentId);

    List<OcrExtractionResponse> getAll(Long tenantId);

    OcrExtractionResponse getLatest(Long tenantId);

    OcrStatsResponse getStats(Long tenantId);
}