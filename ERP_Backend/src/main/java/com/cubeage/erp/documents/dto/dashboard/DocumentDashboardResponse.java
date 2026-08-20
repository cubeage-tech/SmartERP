package com.cubeage.erp.documents.dto.dashboard;

public record DocumentDashboardResponse(
        long totalDocuments,
        long documentsThisMonth,
        double ocrAccuracy,
        long ocrExtractedCount,
        long pendingApprovalCount,
        String nearestApprovalDueDate,
        double storageUsedGb,
        double storageRemainingGb,
        long indexedDocuments,
        long processingDocuments
) {
}