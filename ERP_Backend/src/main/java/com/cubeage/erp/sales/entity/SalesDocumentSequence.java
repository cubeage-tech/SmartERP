package com.cubeage.erp.sales.entity;

import com.cubeage.erp.sales.enums.SalesDocumentType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "sales_document_sequences",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_sales_document_sequence",
                columnNames = {"tenant_id", "document_type", "document_year"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesDocumentSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 20)
    private SalesDocumentType documentType;

    @Column(name = "document_year", nullable = false)
    private Integer documentYear;

    @Column(name = "next_value", nullable = false)
    private Long nextValue;

    @Version
    private Long version;
}
