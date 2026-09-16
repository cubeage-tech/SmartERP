package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "documents", indexes = {
        @Index(name = "idx_documents_tenant", columnList = "tenant_id"),
        @Index(name = "idx_documents_tenant_status", columnList = "tenant_id,status"),
        @Index(name = "idx_documents_tenant_type", columnList = "tenant_id,type"),
        @Index(name = "idx_documents_tenant_category", columnList = "tenant_id,category"),
        @Index(name = "idx_documents_created_at", columnList = "tenant_id,created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "document_number", nullable = false, length = 60)
    private String documentNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DocumentType type;

    @Column(name = "document_date")
    private LocalDate documentDate;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "stored_file_name", nullable = false)
    private String storedFileName;

    @Column(name = "storage_path", nullable = false, length = 1200)
    private String storagePath;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "current_version", nullable = false)
    private Integer currentVersion;

    @Column(length = 100)
    private String category;

    @Column(name = "sub_category", length = 100)
    private String subCategory;

    @Column(name = "company_name", length = 255)
    private String companyName;

    @Column(name = "branch_name", length = 255)
    private String branchName;

    @Column(name = "department_name", length = 255)
    private String departmentName;

    @Column(name = "related_module", length = 100)
    private String relatedModule;

    @Column(name = "related_record", length = 255)
    private String relatedRecord;

    @Column(name = "vendor_name", length = 255)
    private String vendorName;

    @Column(name = "employee_name", length = 255)
    private String employeeName;

    @Column(name = "document_owner", length = 255)
    private String documentOwner;

    @Column(name = "ocr_enabled", nullable = false)
    private Boolean ocrEnabled;

    @Column(name = "auto_extract", nullable = false)
    private Boolean autoExtract;

    @Column(name = "ocr_language", length = 50)
    private String ocrLanguage;

    @Column(name = "ocr_template", length = 100)
    private String ocrTemplate;

    @Column(name = "ocr_completed", nullable = false)
    private Boolean ocrCompleted;

    @Column(name = "ocr_confidence")
    private Double ocrConfidence;

    @Column(name = "approval_required", nullable = false)
    private Boolean approvalRequired;

    @Column(name = "workflow_name", length = 100)
    private String workflowName;

    @Column(name = "approver_name", length = 255)
    private String approverName;

    @Column(name = "approver_user_id")
    private Long approverUserId;

    @Column(name = "access_level", length = 50)
    private String accessLevel;

    @Column(name = "shared_with", length = 255)
    private String sharedWith;

    @Column(nullable = false)
    private Boolean confidential;

    @Column(name = "allow_download", nullable = false)
    private Boolean allowDownload;

    @Column(name = "allow_print", nullable = false)
    private Boolean allowPrint;

    @Column(name = "allow_share", nullable = false)
    private Boolean allowShare;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DocumentStatus status;

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    @Column(name = "uploaded_by_name")
    private String uploadedByName;

    @Builder.Default
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentTag> tags = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("versionNumber DESC")
    private List<DocumentVersion> versions = new ArrayList<>();

    public void addTag(DocumentTag tag) {
        tags.add(tag);
        tag.setDocument(this);
    }

    public void clearTags() {
        tags.clear();
    }

    public void addVersion(DocumentVersion version) {
        versions.add(version);
        version.setDocument(this);
    }
}