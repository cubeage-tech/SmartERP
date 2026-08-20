package com.cubeage.erp.documents.service.impl;

import com.cubeage.erp.documents.dto.dashboard.DocumentDashboardResponse;
import com.cubeage.erp.documents.enums.ApprovalStatus;
import com.cubeage.erp.documents.enums.OcrStatus;
import com.cubeage.erp.documents.repository.DocumentApprovalRepository;
import com.cubeage.erp.documents.repository.DocumentRepository;
import com.cubeage.erp.documents.repository.OcrExtractionRepository;
import com.cubeage.erp.documents.service.DocumentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentDashboardServiceImpl implements DocumentDashboardService {

    private final DocumentRepository documentRepository;
    private final DocumentApprovalRepository approvalRepository;
    private final OcrExtractionRepository ocrRepository;

    @Value("${app.documents.storage-limit-gb:100}")
    private double storageLimitGb;

    @Override
    public DocumentDashboardResponse getDashboard(Long companyId) {
        long totalDocuments = documentRepository.countByCompanyId(companyId);

        long documentsThisMonth = documentRepository
                .countByCompanyIdAndCreatedAtGreaterThanEqual(
                        companyId,
                        YearMonth.now().atDay(1).atStartOfDay()
                );

        List<OcrStatus> indexedStatuses = List.of(
                OcrStatus.COMPLETED,
                OcrStatus.MANUAL_REVIEW
        );

        double ocrAccuracy = Optional.ofNullable(
                ocrRepository.averageConfidence(companyId, indexedStatuses)
        ).orElse(0.0);

        long ocrExtractedCount = ocrRepository.countIndexed(companyId, indexedStatuses);

        long pendingApprovalCount = approvalRepository
                .countByCompanyIdAndStatus(companyId, ApprovalStatus.PENDING);

        String nearestApprovalDueDate = approvalRepository
                .findByCompanyIdAndStatusOrderByDueDateAsc(companyId, ApprovalStatus.PENDING)
                .stream()
                .filter(approval -> approval.getDueDate() != null)
                .findFirst()
                .map(approval -> approval.getDueDate().toString())
                .orElse(null);

        long bytes = Optional.ofNullable(
                documentRepository.sumFileSizeByCompanyId(companyId)
        ).orElse(0L);

        double storageUsedGb = bytes / 1024d / 1024d / 1024d;
        double storageRemainingGb = Math.max(0.0, storageLimitGb - storageUsedGb);

        long processingDocuments = ocrRepository
                .countByCompanyIdAndStatus(companyId, OcrStatus.PROCESSING);

        return new DocumentDashboardResponse(
                totalDocuments,
                documentsThisMonth,
                ocrAccuracy,
                ocrExtractedCount,
                pendingApprovalCount,
                nearestApprovalDueDate,
                storageUsedGb,
                storageRemainingGb,
                ocrExtractedCount,
                processingDocuments
        );
    }
}