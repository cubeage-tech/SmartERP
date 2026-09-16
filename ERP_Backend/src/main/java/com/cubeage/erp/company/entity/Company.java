package com.cubeage.erp.company.entity;

import com.cubeage.erp.company.enums.CompanyRecordStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "companies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    @Column(nullable = false, length = 160)
    private String name;
    @Column(nullable = false, length = 30)
    private String code;
    @Column(name = "company_type", length = 60)
    private String companyType;
    private String industry;
    @Column(name = "registration_number", length = 80)
    private String registrationNumber;
    @Column(name = "gst_number", length = 20)
    private String gstNumber;
    @Column(length = 15)
    private String pan;
    @Column(length = 30)
    private String cin;
    private String website;
    private String email;
    @Column(length = 30)
    private String phone;
    @Column(name = "address_line_1")
    private String addressLine1;
    @Column(name = "address_line_2")
    private String addressLine2;
    private String country;
    private String state;
    private String city;
    @Column(name = "pin_code", length = 12)
    private String pinCode;
    @Column(length = 60)
    private String currency;
    @Column(length = 80)
    private String timezone;
    @Column(name = "financial_year", length = 40)
    private String financialYear;
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    @Column(name = "founded_on")
    private LocalDate foundedOn;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CompanyRecordStatus status = CompanyRecordStatus.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
