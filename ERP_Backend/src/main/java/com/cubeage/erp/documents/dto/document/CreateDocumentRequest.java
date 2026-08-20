package com.cubeage.erp.documents.dto.document;

import com.cubeage.erp.documents.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDocumentRequest(
        @NotBlank String title,
        @NotNull DocumentType type,
        String tags,
        Boolean ocrEnabled
) {
}