package com.cubeage.erp.documents.dto.document;

import com.cubeage.erp.documents.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateDocumentRequest(
        @NotBlank String title,
        @NotNull DocumentType type,
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
        Boolean ocrEnabled,
        Boolean autoExtract,
        String ocrLanguage,
        String ocrTemplate,
        Boolean approvalRequired,
        String workflowName,
        String approverName,
        Long approverUserId,
        String accessLevel,
        String sharedWith,
        Boolean confidential,
        Boolean allowDownload,
        Boolean allowPrint,
        Boolean allowShare,
        String internalNotes,
        String comments
) {
}