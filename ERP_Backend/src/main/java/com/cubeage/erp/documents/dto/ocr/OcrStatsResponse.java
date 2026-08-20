package com.cubeage.erp.documents.dto.ocr;

public record OcrStatsResponse(
        long documentsProcessed,
        long processedThisMonth,
        double averageAccuracy,
        double targetAccuracy,
        double autoPostedToGlPercent,
        long autoPostedDocuments,
        long manualReviewCount
) {
}