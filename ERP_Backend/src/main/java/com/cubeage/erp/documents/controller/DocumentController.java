package com.cubeage.erp.documents.controller;

import com.cubeage.erp.documents.dto.document.CreateDocumentRequest;
import com.cubeage.erp.documents.dto.document.DocumentResponse;
import com.cubeage.erp.documents.dto.document.DocumentSearchRequest;
import com.cubeage.erp.documents.dto.document.UpdateDocumentRequest;
import com.cubeage.erp.documents.enums.DocumentType;
import com.cubeage.erp.documents.service.DocumentService;
import com.cubeage.erp.security.user.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public DocumentResponse upload(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String documentNumber,
            @RequestParam(required = false) LocalDate documentDate,
            @RequestParam(required = false) LocalDate effectiveDate,
            @RequestParam(required = false) LocalDate expiryDate,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String branchName,
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) String relatedModule,
            @RequestParam(required = false) String relatedRecord,
            @RequestParam(required = false) String vendorName,
            @RequestParam(required = false) String employeeName,
            @RequestParam(required = false) String documentOwner,
            @RequestParam(required = false, defaultValue = "true") Boolean ocrEnabled,
            @RequestParam(required = false, defaultValue = "true") Boolean autoExtract,
            @RequestParam(required = false, defaultValue = "English") String ocrLanguage,
            @RequestParam(required = false) String ocrTemplate,
            @RequestParam(required = false, defaultValue = "false") Boolean approvalRequired,
            @RequestParam(required = false) String workflowName,
            @RequestParam(required = false) String approverName,
            @RequestParam(required = false) Long approverUserId,
            @RequestParam(required = false, defaultValue = "Public") String accessLevel,
            @RequestParam(required = false) String sharedWith,
            @RequestParam(required = false, defaultValue = "false") Boolean confidential,
            @RequestParam(required = false, defaultValue = "true") Boolean allowDownload,
            @RequestParam(required = false, defaultValue = "false") Boolean allowPrint,
            @RequestParam(required = false, defaultValue = "false") Boolean allowShare,
            @RequestParam(required = false) String internalNotes,
            @RequestParam(required = false) String comments
    ) {
        DocumentType docType = DocumentType.fromString(type);
        CreateDocumentRequest request = new CreateDocumentRequest(
                title != null && !title.isBlank() ? title : (file != null ? file.getOriginalFilename() : "Untitled"),
                docType,
                documentNumber,
                documentDate,
                effectiveDate,
                expiryDate,
                description,
                category,
                subCategory,
                tags,
                companyName,
                branchName,
                departmentName,
                relatedModule,
                relatedRecord,
                vendorName,
                employeeName,
                documentOwner,
                ocrEnabled,
                autoExtract,
                ocrLanguage,
                ocrTemplate,
                approvalRequired,
                workflowName,
                approverName,
                approverUserId,
                accessLevel,
                sharedWith,
                confidential,
                allowDownload,
                allowPrint,
                allowShare,
                internalNotes,
                comments
        );

        return service.upload(
                principal.getTenantId(),
                principal.getId(),
                principal.getUsername(),
                file,
                request
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentResponse> getAll(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category
    ) {
        DocumentType docType = (type != null && !type.isBlank()) ? DocumentType.fromString(type) : null;
        return service.getAll(principal.getTenantId(), search, docType, category);
    }

    @GetMapping("/my-uploads")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentResponse> getMyUploads(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return service.getMyUploads(principal.getTenantId(), principal.getId());
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentResponse> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DocumentSearchRequest request
    ) {
        return service.search(principal.getTenantId(), request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public DocumentResponse getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        return service.getById(principal.getTenantId(), id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER', 'SALES_MANAGER')")
    public DocumentResponse update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateDocumentRequest request
    ) {
        return service.update(principal.getTenantId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER')")
    public void delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        service.delete(principal.getTenantId(), id);
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Resource> download(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        DocumentResponse document = service.getById(principal.getTenantId(), id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + sanitize(document.originalFileName()) + "\""
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(service.download(principal.getTenantId(), id));
    }

    @GetMapping("/{documentId}/versions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public List<DocumentService.VersionResponse> getVersions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long documentId
    ) {
        return service.getVersions(principal.getTenantId(), documentId);
    }

    @PostMapping(value = "/{documentId}/versions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER', 'SALES_MANAGER', 'EMPLOYEE')")
    public DocumentService.VersionResponse uploadVersion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long documentId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String changeReason,
            @RequestParam(required = false) String comments
    ) {
        return service.uploadVersion(
                principal.getTenantId(),
                principal.getId(),
                principal.getUsername(),
                documentId,
                file,
                changeReason,
                comments
        );
    }

    @PostMapping("/{documentId}/versions/{versionId}/restore")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_MANAGER', 'HR_MANAGER', 'INVENTORY_MANAGER')")
    public DocumentService.VersionResponse restoreVersion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long documentId,
            @PathVariable Long versionId
    ) {
        return service.restoreVersion(principal.getTenantId(), documentId, versionId);
    }

    @GetMapping("/{documentId}/versions/{versionId}/download")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TENANT_ADMIN', 'FINANCE_MANAGER', 'SALES_MANAGER', 'HR_MANAGER', 'OPERATIONS_MANAGER', 'INVENTORY_MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Resource> downloadVersion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long documentId,
            @PathVariable Long versionId
    ) {
        String fileName = service.getVersions(principal.getTenantId(), documentId)
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
                .body(service.downloadVersion(principal.getTenantId(), documentId, versionId));
    }

    private String sanitize(String fileName) {
        return fileName == null ? "document" : fileName.replace("\"", "");
    }
}