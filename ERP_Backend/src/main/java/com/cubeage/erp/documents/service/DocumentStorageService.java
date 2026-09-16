package com.cubeage.erp.documents.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentStorageService {

    StoredFile store(Long tenantId, MultipartFile file);

    Resource load(String storagePath);

    void delete(String storagePath);

    record StoredFile(
            String originalFileName,
            String storedFileName,
            String storagePath,
            String mimeType,
            long fileSize
    ) {
    }
}