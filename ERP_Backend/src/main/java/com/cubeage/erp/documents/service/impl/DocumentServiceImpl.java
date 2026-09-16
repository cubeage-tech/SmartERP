package com.cubeage.erp.documents.service.impl;

import com.cubeage.erp.documents.dto.approval.DocumentApprovalRequest;
import com.cubeage.erp.documents.dto.document.CreateDocumentRequest;
import com.cubeage.erp.documents.dto.document.DocumentResponse;
import com.cubeage.erp.documents.dto.document.DocumentSearchRequest;
import com.cubeage.erp.documents.dto.document.UpdateDocumentRequest;
import com.cubeage.erp.documents.entity.Document;
import com.cubeage.erp.documents.entity.DocumentTag;
import com.cubeage.erp.documents.entity.DocumentVersion;
import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;
import com.cubeage.erp.documents.exception.DocumentNotFoundException;
import com.cubeage.erp.documents.mapper.DocumentMapper;
import com.cubeage.erp.documents.repository.DocumentRepository;
import com.cubeage.erp.documents.repository.DocumentVersionRepository;
import com.cubeage.erp.documents.service.DocumentApprovalService;
import com.cubeage.erp.documents.service.DocumentOcrService;
import com.cubeage.erp.documents.service.DocumentService;
import com.cubeage.erp.documents.service.DocumentStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;
    private final DocumentStorageService storageService;
    private final DocumentOcrService ocrService;
    private final DocumentApprovalService approvalService;
    private final DocumentMapper mapper;

    @Override
    public DocumentResponse upload(
            Long tenantId,
            Long userId,
            String userName,
            MultipartFile file,
            CreateDocumentRequest request
    ) {
        if (request == null || request.type() == null) {
            throw new IllegalArgumentException("Document type is required");
        }

        DocumentStorageService.StoredFile stored = storageService.store(tenantId, file);

        String docNum = request.documentNumber() != null && !request.documentNumber().isBlank()
                ? request.documentNumber().trim()
                : nextDocumentNumber();

        DocumentStatus initialStatus = Boolean.TRUE.equals(request.approvalRequired())
                ? DocumentStatus.PENDING
                : DocumentStatus.ACTIVE;

        Document document = Document.builder()
                .tenantId(tenantId)
                .documentNumber(docNum)
                .title(request.title() == null || request.title().isBlank()
                        ? stored.originalFileName()
                        : request.title().trim())
                .type(request.type())
                .documentDate(request.documentDate())
                .effectiveDate(request.effectiveDate())
                .expiryDate(request.expiryDate())
                .description(request.description())
                .originalFileName(stored.originalFileName())
                .storedFileName(stored.storedFileName())
                .storagePath(stored.storagePath())
                .mimeType(stored.mimeType())
                .fileSize(stored.fileSize())
                .currentVersion(1)
                .category(request.category())
                .subCategory(request.subCategory())
                .companyName(request.companyName())
                .branchName(request.branchName())
                .departmentName(request.departmentName())
                .relatedModule(request.relatedModule())
                .relatedRecord(request.relatedRecord())
                .vendorName(request.vendorName())
                .employeeName(request.employeeName())
                .documentOwner(request.documentOwner() != null && !request.documentOwner().isBlank()
                        ? request.documentOwner()
                        : userName)
                .ocrEnabled(Boolean.TRUE.equals(request.ocrEnabled()))
                .autoExtract(request.autoExtract() == null || Boolean.TRUE.equals(request.autoExtract()))
                .ocrLanguage(request.ocrLanguage() == null ? "English" : request.ocrLanguage())
                .ocrTemplate(request.ocrTemplate())
                .ocrCompleted(false)
                .ocrConfidence(null)
                .approvalRequired(Boolean.TRUE.equals(request.approvalRequired()))
                .workflowName(request.workflowName())
                .approverName(request.approverName())
                .approverUserId(request.approverUserId())
                .accessLevel(request.accessLevel() == null ? "Public" : request.accessLevel())
                .sharedWith(request.sharedWith())
                .confidential(Boolean.TRUE.equals(request.confidential()))
                .allowDownload(request.allowDownload() == null || Boolean.TRUE.equals(request.allowDownload()))
                .allowPrint(Boolean.TRUE.equals(request.allowPrint()))
                .allowShare(Boolean.TRUE.equals(request.allowShare()))
                .internalNotes(request.internalNotes())
                .comments(request.comments())
                .status(initialStatus)
                .uploadedByUserId(userId)
                .uploadedByName(userName)
                .build();

        addTags(document, tenantId, request.tags());
        document = documentRepository.save(document);

        DocumentVersion firstVersion = DocumentVersion.builder()
                .tenantId(tenantId)
                .document(document)
                .versionNumber(1)
                .originalFileName(stored.originalFileName())
                .storedFileName(stored.storedFileName())
                .storagePath(stored.storagePath())
                .mimeType(stored.mimeType())
                .fileSize(stored.fileSize())
                .uploadedByUserId(userId)
                .uploadedByName(userName)
                .changeReason("Initial upload")
                .comments(request.comments())
                .build();

        versionRepository.save(firstVersion);

        // Trigger OCR if enabled
        if (Boolean.TRUE.equals(document.getOcrEnabled())) {
            ocrService.process(tenantId, document.getId());
            document = getEntity(tenantId, document.getId());
        }

        // Trigger Approval if required
        if (Boolean.TRUE.equals(document.getApprovalRequired()) && request.approverUserId() != null) {
            approvalService.create(tenantId, userId, userName, new DocumentApprovalRequest(
                    document.getId(),
                    request.approverUserId(),
                    request.approverName(),
                    request.expiryDate() != null ? request.expiryDate() : LocalDate.now().plusDays(7),
                    "Automatic submission on upload"
            ));
        }

        return mapper.toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll(Long tenantId, String search, DocumentType type, String category) {
        String normalizedSearch = normalizeSearch(search);
        String normalizedCategory = normalizeSearch(category);

        if (normalizedSearch == null && type == null && normalizedCategory == null) {
            return documentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId)
                    .stream()
                    .map(mapper::toResponse)
                    .toList();
        }

        return documentRepository.search(tenantId, normalizedSearch, type, normalizedCategory)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getMyUploads(Long tenantId, Long userId) {
        return documentRepository
                .findByTenantIdAndUploadedByUserIdOrderByCreatedAtDesc(tenantId, userId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> search(Long tenantId, DocumentSearchRequest request) {
        String normalizedSearch = normalizeSearch(request.search());
        String normalizedCategory = normalizeSearch(request.category());

        return documentRepository.search(tenantId, normalizedSearch, request.type(), normalizedCategory)
                .stream()
                .filter(d -> request.status() == null || d.getStatus() == request.status())
                .filter(d -> request.uploadedByUserId() == null
                        || request.uploadedByUserId().equals(d.getUploadedByUserId()))
                .filter(d -> request.fromDate() == null
                        || !d.getCreatedAt().toLocalDate().isBefore(request.fromDate()))
                .filter(d -> request.toDate() == null
                        || !d.getCreatedAt().toLocalDate().isAfter(request.toDate()))
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getById(Long tenantId, Long id) {
        return mapper.toResponse(getEntity(tenantId, id));
    }

    @Override
    public DocumentResponse update(Long tenantId, Long id, UpdateDocumentRequest request) {
        Document document = getEntity(tenantId, id);

        if (request.title() != null && !request.title().isBlank()) {
            document.setTitle(request.title().trim());
        }
        if (request.type() != null) {
            document.setType(request.type());
        }
        if (request.documentNumber() != null && !request.documentNumber().isBlank()) {
            document.setDocumentNumber(request.documentNumber().trim());
        }
        if (request.documentDate() != null) {
            document.setDocumentDate(request.documentDate());
        }
        if (request.effectiveDate() != null) {
            document.setEffectiveDate(request.effectiveDate());
        }
        if (request.expiryDate() != null) {
            document.setExpiryDate(request.expiryDate());
        }
        if (request.description() != null) {
            document.setDescription(request.description());
        }
        if (request.category() != null) {
            document.setCategory(request.category());
        }
        if (request.subCategory() != null) {
            document.setSubCategory(request.subCategory());
        }
        if (request.companyName() != null) {
            document.setCompanyName(request.companyName());
        }
        if (request.branchName() != null) {
            document.setBranchName(request.branchName());
        }
        if (request.departmentName() != null) {
            document.setDepartmentName(request.departmentName());
        }
        if (request.relatedModule() != null) {
            document.setRelatedModule(request.relatedModule());
        }
        if (request.relatedRecord() != null) {
            document.setRelatedRecord(request.relatedRecord());
        }
        if (request.vendorName() != null) {
            document.setVendorName(request.vendorName());
        }
        if (request.employeeName() != null) {
            document.setEmployeeName(request.employeeName());
        }
        if (request.documentOwner() != null) {
            document.setDocumentOwner(request.documentOwner());
        }
        if (request.accessLevel() != null) {
            document.setAccessLevel(request.accessLevel());
        }
        if (request.sharedWith() != null) {
            document.setSharedWith(request.sharedWith());
        }
        if (request.confidential() != null) {
            document.setConfidential(request.confidential());
        }
        if (request.allowDownload() != null) {
            document.setAllowDownload(request.allowDownload());
        }
        if (request.allowPrint() != null) {
            document.setAllowPrint(request.allowPrint());
        }
        if (request.allowShare() != null) {
            document.setAllowShare(request.allowShare());
        }
        if (request.internalNotes() != null) {
            document.setInternalNotes(request.internalNotes());
        }
        if (request.comments() != null) {
            document.setComments(request.comments());
        }
        if (request.status() != null) {
            document.setStatus(request.status());
        }

        if (request.tags() != null) {
            document.clearTags();
            addTags(document, tenantId, request.tags());
        }

        return mapper.toResponse(documentRepository.save(document));
    }

    @Override
    public void delete(Long tenantId, Long id) {
        Document document = getEntity(tenantId, id);

        // Delete physical file from storage
        storageService.delete(document.getStoragePath());

        // Delete version physical files
        List<DocumentVersion> versions = versionRepository
                .findByDocument_IdAndTenantIdOrderByVersionNumberDesc(id, tenantId);
        for (DocumentVersion v : versions) {
            storageService.delete(v.getStoragePath());
        }

        documentRepository.delete(document);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource download(Long tenantId, Long id) {
        Document document = getEntity(tenantId, id);
        return storageService.load(document.getStoragePath());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentService.VersionResponse> getVersions(Long tenantId, Long documentId) {
        Document document = getEntity(tenantId, documentId);

        return versionRepository.findByDocument_IdAndTenantIdOrderByVersionNumberDesc(documentId, tenantId)
                .stream()
                .map(version -> toVersionResponse(version, document.getCurrentVersion()))
                .toList();
    }

    @Override
    public DocumentService.VersionResponse uploadVersion(
            Long tenantId,
            Long userId,
            String userName,
            Long documentId,
            MultipartFile file,
            String changeReason,
            String comments
    ) {
        Document document = getEntity(tenantId, documentId);
        DocumentStorageService.StoredFile stored = storageService.store(tenantId, file);

        int nextVersion = versionRepository.findTopByDocument_IdAndTenantIdOrderByVersionNumberDesc(documentId, tenantId)
                .map(existing -> existing.getVersionNumber() + 1)
                .orElse(1);

        DocumentVersion version = DocumentVersion.builder()
                .tenantId(tenantId)
                .document(document)
                .versionNumber(nextVersion)
                .originalFileName(stored.originalFileName())
                .storedFileName(stored.storedFileName())
                .storagePath(stored.storagePath())
                .mimeType(stored.mimeType())
                .fileSize(stored.fileSize())
                .uploadedByUserId(userId)
                .uploadedByName(userName)
                .changeReason(changeReason)
                .comments(comments)
                .build();

        version = versionRepository.save(version);

        document.setCurrentVersion(nextVersion);
        document.setOriginalFileName(stored.originalFileName());
        document.setStoredFileName(stored.storedFileName());
        document.setStoragePath(stored.storagePath());
        document.setMimeType(stored.mimeType());
        document.setFileSize(stored.fileSize());
        document.setOcrCompleted(false);
        document.setOcrConfidence(null);
        documentRepository.save(document);

        if (Boolean.TRUE.equals(document.getOcrEnabled())) {
            ocrService.process(tenantId, documentId);
        }

        return toVersionResponse(version, nextVersion);
    }

    @Override
    public DocumentService.VersionResponse restoreVersion(Long tenantId, Long documentId, Long versionId) {
        Document document = getEntity(tenantId, documentId);

        DocumentVersion version = versionRepository.findByIdAndDocument_IdAndTenantId(versionId, documentId, tenantId)
                .orElseThrow(() -> new DocumentNotFoundException(versionId));

        document.setCurrentVersion(version.getVersionNumber());
        document.setOriginalFileName(version.getOriginalFileName());
        document.setStoredFileName(version.getStoredFileName());
        document.setStoragePath(version.getStoragePath());
        document.setMimeType(version.getMimeType());
        document.setFileSize(version.getFileSize());
        document.setOcrCompleted(false);
        document.setOcrConfidence(null);
        documentRepository.save(document);

        if (Boolean.TRUE.equals(document.getOcrEnabled())) {
            ocrService.process(tenantId, documentId);
        }

        return toVersionResponse(version, version.getVersionNumber());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadVersion(Long tenantId, Long documentId, Long versionId) {
        getEntity(tenantId, documentId);

        DocumentVersion version = versionRepository.findByIdAndDocument_IdAndTenantId(versionId, documentId, tenantId)
                .orElseThrow(() -> new DocumentNotFoundException(versionId));

        return storageService.load(version.getStoragePath());
    }

    private Document getEntity(Long tenantId, Long id) {
        return documentRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    private DocumentService.VersionResponse toVersionResponse(DocumentVersion version, Integer currentVersion) {
        return new DocumentService.VersionResponse(
                version.getId(),
                version.getVersionNumber(),
                version.getOriginalFileName(),
                version.getMimeType(),
                version.getFileSize(),
                version.getUploadedByUserId(),
                version.getUploadedByName(),
                version.getChangeReason(),
                version.getComments(),
                version.getCreatedAt(),
                version.getVersionNumber().equals(currentVersion)
        );
    }

    private void addTags(Document document, Long tenantId, String tags) {
        if (tags == null || tags.isBlank()) {
            return;
        }

        List<String> uniqueTags = java.util.Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .toList();

        uniqueTags.forEach(tag -> document.addTag(
                DocumentTag.builder()
                        .tenantId(tenantId)
                        .name(tag)
                        .build()
        ));
    }

    private String normalizeSearch(String search) {
        return search == null || search.isBlank() ? null : search.trim();
    }

    private String nextDocumentNumber() {
        return "DOC-" + LocalDate.now().getYear() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}