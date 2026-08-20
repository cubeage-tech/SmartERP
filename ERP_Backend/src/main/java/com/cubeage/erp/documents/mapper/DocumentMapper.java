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
                document.getDocumentNumber(),
                document.getTitle(),
                document.getType() == null ? null : document.getType().getLabel(),
                tags,
                document.getOriginalFileName(),
                document.getMimeType(),
                document.getFileSize(),
                lower(document.getStatus()),
                document.getOcrCompleted(),
                document.getOcrConfidence(),
                document.getUploadedByUserId(),
                document.getUploadedByName(),
                document.getCurrentVersion(),
                document.getCreatedAt(),
                document.getUpdatedAt()
        );
    }

    public DocumentApprovalResponse toApprovalResponse(DocumentApproval approval) {
        return new DocumentApprovalResponse(
                approval.getId(),
                approval.getDocument().getId(),
                approval.getDocument().getTitle(),
                approval.getDocument().getType().getLabel(),
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
