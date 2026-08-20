package com.cubeage.erp.documents.dto.document;

import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;

public record UpdateDocumentRequest(
        String title,
        DocumentType type,
        String tags,
        DocumentStatus status
) {
}