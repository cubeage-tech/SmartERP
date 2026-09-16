package com.cubeage.erp.documents.service.impl;

import com.cubeage.erp.documents.exception.DocumentUploadException;
import com.cubeage.erp.documents.service.DocumentStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class DocumentStorageServiceImpl implements DocumentStorageService {

    private final Path root;

    public DocumentStorageServiceImpl(
            @Value("${app.documents.storage-path:uploads/documents}") String rootPath
    ) {
        this.root = Paths.get(rootPath).toAbsolutePath().normalize();
    }

    @Override
    public StoredFile store(Long tenantId, MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new DocumentUploadException("Document file is required");
            }

            String original = file.getOriginalFilename() == null
                    ? "document"
                    : Paths.get(file.getOriginalFilename()).getFileName().toString();

            String clean = original.replaceAll("[^a-zA-Z0-9._-]", "_");
            String stored = UUID.randomUUID() + "_" + clean;

            Path tenantDirectory = root.resolve(String.valueOf(tenantId));
            Files.createDirectories(tenantDirectory);

            Path target = tenantDirectory.resolve(stored).normalize();

            if (!target.startsWith(tenantDirectory)) {
                throw new DocumentUploadException("Invalid storage path");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFile(
                    original,
                    stored,
                    target.toString(),
                    file.getContentType(),
                    file.getSize()
            );

        } catch (DocumentUploadException e) {
            throw e;
        } catch (Exception e) {
            throw new DocumentUploadException("Unable to store document", e);
        }
    }

    @Override
    public Resource load(String storagePath) {
        try {
            Resource resource = new UrlResource(Paths.get(storagePath).toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new DocumentUploadException("Stored document is not readable");
            }

            return resource;
        } catch (DocumentUploadException e) {
            throw e;
        } catch (Exception e) {
            throw new DocumentUploadException("Unable to load document", e);
        }
    }

    @Override
    public void delete(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) return;
        try {
            Path target = Paths.get(storagePath).normalize();
            if (target.startsWith(root)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ignored) {
        }
    }
}