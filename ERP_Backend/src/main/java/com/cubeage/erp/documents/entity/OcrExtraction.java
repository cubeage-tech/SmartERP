package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import com.cubeage.erp.documents.enums.OcrStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_ocr_extractions", indexes = {
        @Index(name = "idx_document_ocr_tenant", columnList = "tenant_id"),
        @Index(name = "idx_document_ocr_status", columnList = "tenant_id,status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_document_ocr", columnNames = {"document_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcrExtraction extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    private Document document;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OcrStatus status;

    private Double confidence;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "invoice_date")
    private String invoiceDate;

    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    private String gstin;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "extracted_text", columnDefinition = "TEXT")
    private String extractedText;

    @Column(name = "auto_posted_to_gl", nullable = false)
    private Boolean autoPostedToGl;

    @Column(name = "manual_review_required", nullable = false)
    private Boolean manualReviewRequired;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}
