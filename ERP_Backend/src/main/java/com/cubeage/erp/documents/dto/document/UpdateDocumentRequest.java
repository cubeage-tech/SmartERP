package com.cubeage.erp.documents.dto.document;

import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;

import java.time.LocalDate;

public record UpdateDocumentRequest(
        String title,
        DocumentType type,
        String documentNumber,
        LocalDate documentDate,
        LocalDate effectiveDate,
        LocalDate expiryDate,
        String description,
        String category,
        String subCategory,
        String tags,
        String companyName,
        String branchName,
        String departmentName,
        String relatedModule,
        String relatedRecord,
        String vendorName,
        String employeeName,
        String documentOwner,
        String accessLevel,
        String sharedWith,
        Boolean confidential,
        Boolean allowDownload,
        Boolean allowPrint,
        Boolean allowShare,
        String internalNotes,
        String comments,
        DocumentStatus status
) {
}