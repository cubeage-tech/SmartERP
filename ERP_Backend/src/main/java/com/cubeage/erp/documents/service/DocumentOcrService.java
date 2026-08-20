package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.dto.ocr.OcrStatsResponse;

import java.util.List;

public interface DocumentOcrService {

    OcrExtractionResponse process(Long companyId, Long documentId);

    List<OcrExtractionResponse> getAll(Long companyId);

    OcrExtractionResponse getLatest(Long companyId);

    OcrStatsResponse getStats(Long companyId);
}