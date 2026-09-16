package com.cubeage.erp.documents.service;

import com.cubeage.erp.documents.dto.document.CreateDocumentRequest;
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
            Long tenantId,
            Long userId,
            String userName,
            MultipartFile file,
            CreateDocumentRequest request
    );

    List<DocumentResponse> getAll(Long tenantId, String search, DocumentType type, String category);

    List<DocumentResponse> getMyUploads(Long tenantId, Long userId);

    List<DocumentResponse> search(Long tenantId, DocumentSearchRequest request);

    DocumentResponse getById(Long tenantId, Long id);

    DocumentResponse update(Long tenantId, Long id, UpdateDocumentRequest request);

    void delete(Long tenantId, Long id);

    Resource download(Long tenantId, Long id);

    List<VersionResponse> getVersions(Long tenantId, Long documentId);

    VersionResponse uploadVersion(
            Long tenantId,
            Long userId,
            String userName,
            Long documentId,
            MultipartFile file,
            String changeReason,
            String comments
    );

    VersionResponse restoreVersion(Long tenantId, Long documentId, Long versionId);

    Resource downloadVersion(Long tenantId, Long documentId, Long versionId);

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
