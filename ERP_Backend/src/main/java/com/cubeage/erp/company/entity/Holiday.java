package com.cubeage.erp.company.entity;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "company_holidays")
@Getter 
@Setter 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Holiday {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Column(nullable = false, length = 140)
    private String name;
    @Column(name = "holiday_date", nullable = false)
    private LocalDate date;
    @Column(name = "holiday_type", nullable = false, length = 60)
    private String type;
    @Column(name = "applies_to", nullable = false, length = 240)
    private String appliesTo;
    @Column(nullable = false)
    @Builder.Default
    private Boolean optional = false;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CompanyRecordStatus status = CompanyRecordStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
