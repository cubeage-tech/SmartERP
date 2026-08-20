package com.cubeage.erp.documents.dto.document;

import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;

import java.time.LocalDate;

public record DocumentSearchRequest(
        String search,
        DocumentType type,
        DocumentStatus status,
        LocalDate fromDate,
        LocalDate toDate,
        Long uploadedByUserId
) {
}