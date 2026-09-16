package com.cubeage.erp.documents.entity;

import com.cubeage.erp.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "document_tags", indexes = {
        @Index(name = "idx_document_tags_tenant", columnList = "tenant_id"),
        @Index(name = "idx_document_tags_name", columnList = "tenant_id,name")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_document_tags", columnNames = {"document_id", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTag extends BaseEntity {

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(nullable = false, length = 100)
    private String name;
}