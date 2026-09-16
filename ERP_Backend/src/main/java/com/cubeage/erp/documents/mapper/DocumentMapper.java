package com.cubeage.erp.documents.mapper;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;
import com.cubeage.erp.documents.dto.document.DocumentResponse;
import com.cubeage.erp.documents.entity.Document;
import com.cubeage.erp.documents.entity.DocumentApproval;
import com.cubeage.erp.documents.entity.DocumentTag;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DocumentMapper {

    public DocumentResponse toResponse(Document document) {
        String tags = document.getTags() == null
                ? ""
                : document.getTags().stream()
                .map(DocumentTag::getName)
                .collect(Collectors.joining(","));

        return new DocumentResponse(
                document.getId(),
                document.getTenantId(),
                document.getDocumentNumber(),
                document.getTitle(),
                document.getType() == null ? null : document.getType().getLabel(),
                document.getDocumentDate(),
                document.getEffectiveDate(),
                document.getExpiryDate(),
                document.getDescription(),
                document.getOriginalFileName(),
                document.getStoredFileName(),
                document.getMimeType(),
                document.getFileSize(),
                document.getCurrentVersion(),
                document.getCategory(),
                document.getSubCategory(),
                tags,
                document.getCompanyName(),
                document.getBranchName(),
                document.getDepartmentName(),
                document.getRelatedModule(),
                document.getRelatedRecord(),
                document.getVendorName(),
                document.getEmployeeName(),
                document.getDocumentOwner(),
                document.getOcrEnabled(),
                document.getAutoExtract(),
                document.getOcrLanguage(),
                document.getOcrTemplate(),
                document.getOcrCompleted(),
                document.getOcrConfidence(),
                document.getApprovalRequired(),
                document.getWorkflowName(),
                document.getApproverName(),
                document.getApproverUserId(),
                document.getAccessLevel(),
                document.getSharedWith(),
                document.getConfidential(),
                document.getAllowDownload(),
                document.getAllowPrint(),
                document.getAllowShare(),
                document.getInternalNotes(),
                document.getComments(),
                lower(document.getStatus()),
                document.getUploadedByUserId(),
                document.getUploadedByName(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }

    public DocumentApprovalResponse toApprovalResponse(DocumentApproval approval) {
        return new DocumentApprovalResponse(
                approval.getId(),
                approval.getDocument().getId(),
                approval.getDocument().getTitle(),
                approval.getDocument().getType() == null ? null : approval.getDocument().getType().getLabel(),
                approval.getSubmittedByUserId(),
                approval.getSubmittedByName(),
                approval.getApproverUserId(),
                approval.getApproverName(),
                approval.getCreatedAt(),
                approval.getDueDate(),
                lower(approval.getStatus()),
                approval.getComment()
        );
    }

    private String lower(Enum<?> value) {
        return value == null ? null : value.name().toLowerCase();
    }
}
