package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;

import java.util.List;

public interface DocumentApprovalService {

    DocumentApprovalResponse create(
            Long tenantId,
            Long userId,
            String userName,
            DocumentApprovalRequest request
    );

    List<DocumentApprovalResponse> getPending(Long tenantId);

    List<DocumentApprovalResponse> getMyPending(Long tenantId, Long userId);

    DocumentApprovalResponse approve(Long tenantId, Long approvalId, String comment);

    DocumentApprovalResponse reject(Long tenantId, Long approvalId, String comment);
}