package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_versions", indexes = {
        @Index(name = "idx_document_versions_tenant", columnList = "tenant_id"),
        @Index(name = "idx_document_versions_doc", columnList = "document_id,version_number")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_document_versions", columnNames = {"document_id", "version_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentVersion extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

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

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    @Column(name = "uploaded_by_name")
    private String uploadedByName;

    @Column(name = "change_reason", length = 1000)
    private String changeReason;

    @Column(columnDefinition = "TEXT")
    private String comments;
}