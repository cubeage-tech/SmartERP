package com.cubeage.erp.documents.service.impl;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.approval.DocumentApprovalResponse;
import com.cubeage.erp.documents.entity.Document;
import com.cubeage.erp.documents.entity.DocumentApproval;
import com.cubeage.erp.documents.enums.ApprovalStatus;
import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.exception.DocumentNotFoundException;
import com.cubeage.erp.documents.mapper.DocumentMapper;
import com.cubeage.erp.documents.repository.DocumentApprovalRepository;
import com.cubeage.erp.documents.repository.DocumentRepository;
import com.cubeage.erp.documents.service.DocumentApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentApprovalServiceImpl implements DocumentApprovalService {

    private final DocumentApprovalRepository approvalRepository;
    private final DocumentRepository documentRepository;
    private final DocumentMapper mapper;

    @Override
    public DocumentApprovalResponse create(
            Long companyId,
            Long userId,
            String userName,
            DocumentApprovalRequest request
    ) {
        Document document = documentRepository.findByIdAndCompanyId(request.documentId(), companyId)
                .orElseThrow(() -> new DocumentNotFoundException(request.documentId()));

        DocumentApproval approval = DocumentApproval.builder()
                .companyId(companyId)
                .document(document)
                .submittedByUserId(userId)
                .submittedByName(userName)
                .approverUserId(request.approverUserId())
                .approverName(request.approverName())
                .dueDate(request.dueDate())
                .status(ApprovalStatus.PENDING)
                .comment(request.comment())
                .build();

        document.setStatus(DocumentStatus.PENDING);
        documentRepository.save(document);

        return mapper.toApprovalResponse(approvalRepository.save(approval));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentApprovalResponse> getPending(Long companyId) {
        return approvalRepository
                .findByCompanyIdAndStatusOrderByDueDateAsc(companyId, ApprovalStatus.PENDING)
                .stream()
                .map(mapper::toApprovalResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentApprovalResponse> getMyPending(Long companyId, Long userId) {
        return approvalRepository
                .findByCompanyIdAndApproverUserIdAndStatusOrderByDueDateAsc(
                        companyId,
                        userId,
                        ApprovalStatus.PENDING
                )
                .stream()
                .map(mapper::toApprovalResponse)
                .toList();
    }

    @Override
    public DocumentApprovalResponse approve(Long companyId, Long approvalId, String comment) {
        DocumentApproval approval = getPendingApproval(companyId, approvalId);

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setComment(comment);
        approval.setActedAt(LocalDateTime.now());

        Document document = approval.getDocument();
        document.setStatus(DocumentStatus.APPROVED);
        documentRepository.save(document);

        return mapper.toApprovalResponse(approvalRepository.save(approval));
    }

    @Override
    public DocumentApprovalResponse reject(Long companyId, Long approvalId, String comment) {
        DocumentApproval approval = getPendingApproval(companyId, approvalId);

        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setComment(comment);
        approval.setActedAt(LocalDateTime.now());

        Document document = approval.getDocument();
        document.setStatus(DocumentStatus.REJECTED);
        documentRepository.save(document);

        return mapper.toApprovalResponse(approvalRepository.save(approval));
    }

    private DocumentApproval getPendingApproval(Long companyId, Long approvalId) {
        DocumentApproval approval = approvalRepository.findByIdAndCompanyId(approvalId, companyId)
                .orElseThrow(() -> new NoSuchElementException("Document approval not found: " + approvalId));

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Approval is already completed");
        }

        return approval;
    }
}
