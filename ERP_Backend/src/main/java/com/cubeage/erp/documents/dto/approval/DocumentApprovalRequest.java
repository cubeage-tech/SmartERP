package com.cubeage.erp.documents.dto.approval;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DocumentApprovalRequest(
        @NotNull Long documentId,
        @NotNull Long approverUserId,
        String approverName,
        LocalDate dueDate,
        String comment
) {
}