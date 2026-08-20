package com.cubeage.erp.documents.dto.approval;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DocumentApprovalResponse(
        Long id,
        Long documentId,
        String documentTitle,
        String documentType,
        Long submittedByUserId,
        String submittedByName,
        Long approverUserId,
        String approverName,
        LocalDateTime submittedAt,
        LocalDate dueDate,
        String status,
        String comment
) {
}
