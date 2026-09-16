package com.cubeage.erp.company.entity;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "company_cost_centers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CostCenter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Column(nullable = false, length = 30)
    private String code;
    @Column(nullable = false, length = 140)
    private String name;
    @Column(length = 500)
    private String description;
    @Column(precision = 19, scale = 2)
    private BigDecimal budget;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CompanyRecordStatus status = CompanyRecordStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
