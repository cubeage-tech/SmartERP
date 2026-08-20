package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.document.DocumentResponse;
import com.cubeage.erp.documents.dto.document.DocumentSearchRequest;
import com.cubeage.erp.documents.dto.document.UpdateDocumentRequest;
import com.cubeage.erp.documents.enums.DocumentType;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public interface DocumentService {

    DocumentResponse upload(
            Long companyId,
            Long userId,
            String userName,
            MultipartFile file,
            String title,
            DocumentType type,
            String tags,
            Boolean ocrEnabled
    );

    List<DocumentResponse> getAll(Long companyId, String search, DocumentType type);

    List<DocumentResponse> getMyUploads(Long companyId, Long userId);

    List<DocumentResponse> search(Long companyId, DocumentSearchRequest request);

    DocumentResponse getById(Long companyId, Long id);

    DocumentResponse update(Long companyId, Long id, UpdateDocumentRequest request);

    Resource download(Long companyId, Long id);

    List<VersionResponse> getVersions(Long companyId, Long documentId);

    VersionResponse uploadVersion(
            Long companyId,
            Long userId,
            String userName,
            Long documentId,
            MultipartFile file,
            String changeReason,
            String comments
    );

    VersionResponse restoreVersion(Long companyId, Long documentId, Long versionId);

    Resource downloadVersion(Long companyId, Long documentId, Long versionId);

    record VersionResponse(
            Long id,
            Integer versionNumber,
            String originalFileName,
            String mimeType,
            Long fileSize,
            Long uploadedByUserId,
            String uploadedByName,
            String changeReason,
            String comments,
            LocalDateTime createdAt,
            boolean current
    ) {
    }
}
