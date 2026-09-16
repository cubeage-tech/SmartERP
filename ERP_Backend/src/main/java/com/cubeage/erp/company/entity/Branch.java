package com.cubeage.erp.company.entity;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity(name = "CompanyBranch")
@Table(name = "company_branches")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Column(nullable = false, length = 140)
    private String name;
    @Column(nullable = false, length = 30)
    private String code;
    @Column(name = "branch_type", nullable = false, length = 60)
    private String branchType;
    @Column(name = "manager_name")
    private String managerName;
    @Column(name = "contact_number", nullable = false, length = 30)
    private String contactNumber;
    @Column(nullable = false)
    private String email;
    @Column(name = "address_line_1", nullable = false)
    private String addressLine1;
    @Column(name = "address_line_2")
    private String addressLine2;
    @Column(nullable = false, length = 80)
    private String country;
    @Column(nullable = false, length = 80)
    private String state;
    @Column(nullable = false, length = 80)
    private String city;
    @Column(name = "pin_code", nullable = false, length = 12)
    private String pinCode;
    @Column(name = "gst_number", length = 20)
    private String gstNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CompanyRecordStatus status = CompanyRecordStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
