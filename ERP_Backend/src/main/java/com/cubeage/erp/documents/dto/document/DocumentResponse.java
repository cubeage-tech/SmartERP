package com.cubeage.erp.documents.dto.document;

import java.time.LocalDateTime;

public record DocumentResponse(
        Long id,
        String documentNumber,
        String title,
        String type,
        String tags,
        String originalFileName,
        String mimeType,
        Long fileSize,
        String status,
        Boolean ocrCompleted,
        Double ocrConfidence,
        Long uploadedByUserId,
        String uploadedByName,
        Integer currentVersion,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}