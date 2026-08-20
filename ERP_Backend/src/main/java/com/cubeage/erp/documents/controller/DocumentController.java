package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.document.DocumentResponse;
import com.cubeage.erp.documents.dto.document.DocumentSearchRequest;
import com.cubeage.erp.documents.dto.document.UpdateDocumentRequest;
import com.cubeage.erp.documents.enums.DocumentType;
import com.cubeage.erp.documents.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentResponse upload(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "User") String userName,
            @RequestPart("file") MultipartFile file,
            @RequestParam String title,
            @RequestParam DocumentType type,
            @RequestParam(required = false) String tags,
            @RequestParam(defaultValue = "true") Boolean ocrEnabled
    ) {
        return service.upload(
                companyId,
                userId,
                userName,
                file,
                title,
                type,
                tags,
                ocrEnabled
        );
    }

    @GetMapping
    public List<DocumentResponse> getAll(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DocumentType type
    ) {
        return service.getAll(companyId, search, type);
    }

    @GetMapping("/my-uploads")
    public List<DocumentResponse> getMyUploads(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        return service.getMyUploads(companyId, userId);
    }

    @PostMapping("/search")
    public List<DocumentResponse> search(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestBody DocumentSearchRequest request
    ) {
        return service.search(companyId, request);
    }

    @GetMapping("/{id}")
    public DocumentResponse getById(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long id
    ) {
        return service.getById(companyId, id);
    }

    @PutMapping("/{id}")
    public DocumentResponse update(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long id,
            @RequestBody UpdateDocumentRequest request
    ) {
        return service.update(companyId, id, request);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long id
    ) {
        DocumentResponse document = service.getById(companyId, id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + sanitize(document.originalFileName()) + "\""
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(service.download(companyId, id));
    }

    @GetMapping("/{documentId}/versions")
    public List<DocumentService.VersionResponse> getVersions(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long documentId
    ) {
        return service.getVersions(companyId, documentId);
    }

    @PostMapping(value = "/{documentId}/versions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentService.VersionResponse uploadVersion(
            @RequestHeader("X-Company-Id") Long companyId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader(value = "X-User-Name", defaultValue = "User") String userName,
            @PathVariable Long documentId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String changeReason,
            @RequestParam(required = false) String comments
    ) {
        return service.uploadVersion(
                companyId,
                userId,
                userName,
                documentId,
                file,
                changeReason,
                comments
        );
    }

    @PostMapping("/{documentId}/versions/{versionId}/restore")
    public DocumentService.VersionResponse restoreVersion(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long documentId,
            @PathVariable Long versionId
    ) {
        return service.restoreVersion(companyId, documentId, versionId);
    }

    @GetMapping("/{documentId}/versions/{versionId}/download")
    public ResponseEntity<Resource> downloadVersion(
            @RequestHeader("X-Company-Id") Long companyId,
            @PathVariable Long documentId,
            @PathVariable Long versionId
    ) {
        String fileName = service.getVersions(companyId, documentId)
                .stream()
                .filter(version -> version.id().equals(versionId))
                .findFirst()
                .map(DocumentService.VersionResponse::originalFileName)
                .orElse("document-version");

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + sanitize(fileName) + "\""
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(service.downloadVersion(companyId, documentId, versionId));
    }

    private String sanitize(String fileName) {
        return fileName == null ? "document" : fileName.replace("\"", "");
    }
}