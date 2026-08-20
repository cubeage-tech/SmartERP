package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;

import java.util.List;

public interface DocumentApprovalService {

    DocumentApprovalResponse create(
            Long companyId,
            Long userId,
            String userName,
            DocumentApprovalRequest request
    );

    List<DocumentApprovalResponse> getPending(Long companyId);

    List<DocumentApprovalResponse> getMyPending(Long companyId, Long userId);

    DocumentApprovalResponse approve(Long companyId, Long approvalId, String comment);

    DocumentApprovalResponse reject(Long companyId, Long approvalId, String comment);
}