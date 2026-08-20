package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.ocr.OcrExtractionResponse;
import com.cubeage.erp.documents.dto.ocr.OcrStatsResponse;
import com.cubeage.erp.documents.service.DocumentOcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents/ocr")
@RequiredArgsConstructor
public class DocumentOcrController {

    private final DocumentOcrService service;

    @GetMapping
    public List<OcrExtractionResponse> getAll(
            @RequestHeader("X-Company-Id") Long companyId
    ) {
        return service.getAll(companyId);
    }

    @GetMapping("/latest")
    public OcrExtractionResponse getLatest(
            @RequestHeader("X-Company-Id") Long companyId
    ) {
        return service.getLatest(companyId);
    }

    @GetMapping("/stats")
    public OcrStatsResponse getStats(
            @RequestHeader("X-Company-Id") Long companyId
    ) {
        return service.getStats(companyId);
    }

    @PostMapping("/{documentId}/process")
    public OcrExtractionResponse process(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long documentId
    ) {
        return service.process(companyId, documentId);
    }
}