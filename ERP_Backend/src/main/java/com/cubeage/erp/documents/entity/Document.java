package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.documents.enums.DocumentStatus;
import com.cubeage.erp.documents.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "documents", indexes = {
        @Index(name = "idx_documents_company", columnList = "company_id"),
        @Index(name = "idx_documents_company_type", columnList = "company_id,type"),
        @Index(name = "idx_documents_company_status", columnList = "company_id,status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "document_number", nullable = false, unique = true, length = 40)
    private String documentNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DocumentType type;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "stored_file_name", nullable = false)
    private String storedFileName;

    @Column(name = "storage_path", nullable = false, length = 1200)
    private String storagePath;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DocumentStatus status;

    @Column(name = "ocr_enabled", nullable = false)
    private Boolean ocrEnabled;

    @Column(name = "ocr_completed", nullable = false)
    private Boolean ocrCompleted;

    @Column(name = "ocr_confidence")
    private Double ocrConfidence;

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    @Column(name = "uploaded_by_name")
    private String uploadedByName;

    @Column(name = "current_version", nullable = false)
    private Integer currentVersion;

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