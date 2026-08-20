package com.cubeage.erp.documents.service.impl;

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
    private final DocumentMapper mapper;

    @Override
    public DocumentResponse upload(
            Long companyId,
            Long userId,
            String userName,
            MultipartFile file,
            String title,
            DocumentType type,
            String tags,
            Boolean ocrEnabled
    ) {
        if (type == null) {
            throw new IllegalArgumentException("Document type is required");
        }

        DocumentStorageService.StoredFile stored = storageService.store(companyId, file);

        Document document = Document.builder()
                .companyId(companyId)
                .documentNumber(nextDocumentNumber())
                .title(title == null || title.isBlank() ? stored.originalFileName() : title.trim())
                .type(type)
                .originalFileName(stored.originalFileName())
                .storedFileName(stored.storedFileName())
                .storagePath(stored.storagePath())
                .mimeType(stored.mimeType())
                .fileSize(stored.fileSize())
                .status(DocumentStatus.ACTIVE)
                .ocrEnabled(Boolean.TRUE.equals(ocrEnabled))
                .ocrCompleted(false)
                .ocrConfidence(null)
                .uploadedByUserId(userId)
                .uploadedByName(userName)
                .currentVersion(1)
                .build();

        addTags(document, tags);
        document = documentRepository.save(document);

        DocumentVersion firstVersion = DocumentVersion.builder()
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
                .comments(null)
                .build();

        versionRepository.save(firstVersion);

        if (Boolean.TRUE.equals(document.getOcrEnabled())) {
            ocrService.process(companyId, document.getId());
            document = getEntity(companyId, document.getId());
        }

        return mapper.toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll(Long companyId, String search, DocumentType type) {
        String normalizedSearch = normalizeSearch(search);

        return documentRepository.search(companyId, normalizedSearch, type)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getMyUploads(Long companyId, Long userId) {
        return documentRepository
                .findByCompanyIdAndUploadedByUserIdOrderByCreatedAtDesc(companyId, userId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> search(Long companyId, DocumentSearchRequest request) {
        String normalizedSearch = normalizeSearch(request.search());

        return documentRepository.search(companyId, normalizedSearch, request.type())
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
    public DocumentResponse getById(Long companyId, Long id) {
        return mapper.toResponse(getEntity(companyId, id));
    }

    @Override
    public DocumentResponse update(Long companyId, Long id, UpdateDocumentRequest request) {
        Document document = getEntity(companyId, id);

        if (request.title() != null && !request.title().isBlank()) {
            document.setTitle(request.title().trim());
        }

        if (request.type() != null) {
            document.setType(request.type());
        }

        if (request.status() != null) {
            document.setStatus(request.status());
        }

        if (request.tags() != null) {
            document.clearTags();
            addTags(document, request.tags());
        }

        return mapper.toResponse(documentRepository.save(document));
    }

    @Override
    @Transactional(readOnly = true)
    public Resource download(Long companyId, Long id) {
        Document document = getEntity(companyId, id);
        return storageService.load(document.getStoragePath());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentService.VersionResponse> getVersions(Long companyId, Long documentId) {
        Document document = getEntity(companyId, documentId);

        return versionRepository.findByDocument_IdOrderByVersionNumberDesc(documentId)
                .stream()
                .map(version -> toVersionResponse(version, document.getCurrentVersion()))
                .toList();
    }

    @Override
    public DocumentService.VersionResponse uploadVersion(
            Long companyId,
            Long userId,
            String userName,
            Long documentId,
            MultipartFile file,
            String changeReason,
            String comments
    ) {
        Document document = getEntity(companyId, documentId);
        DocumentStorageService.StoredFile stored = storageService.store(companyId, file);

        int nextVersion = versionRepository.findTopByDocument_IdOrderByVersionNumberDesc(documentId)
                .map(existing -> existing.getVersionNumber() + 1)
                .orElse(1);

        DocumentVersion version = DocumentVersion.builder()
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
            ocrService.process(companyId, documentId);
        }

        return toVersionResponse(version, nextVersion);
    }

    @Override
    public DocumentService.VersionResponse restoreVersion(Long companyId, Long documentId, Long versionId) {
        Document document = getEntity(companyId, documentId);

        DocumentVersion version = versionRepository.findByIdAndDocument_Id(versionId, documentId)
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
            ocrService.process(companyId, documentId);
        }

        return toVersionResponse(version, version.getVersionNumber());
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadVersion(Long companyId, Long documentId, Long versionId) {
        getEntity(companyId, documentId);

        DocumentVersion version = versionRepository.findByIdAndDocument_Id(versionId, documentId)
                .orElseThrow(() -> new DocumentNotFoundException(versionId));

        return storageService.load(version.getStoragePath());
    }

    private Document getEntity(Long companyId, Long id) {
        return documentRepository.findByIdAndCompanyId(id, companyId)
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

    private void addTags(Document document, String tags) {
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