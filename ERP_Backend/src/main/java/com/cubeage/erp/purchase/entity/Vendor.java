package com.cubeage.erp.purchase.entity;

import com.cubeage.erp.purchase.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
        name = "purchase_vendors",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_purchase_vendor_code",
                columnNames = {"tenant_id", "vendor_code"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "vendor_code", nullable = false, length = 30)
    private String vendorCode;

    @Column(nullable = false)
    private String vendorName;

    @Column(nullable = false)
    private String contactName;

    private String phone;
    private String email;
    private String city;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String category;
    private String gstin;
    private String pan;
    private String paymentTerms;

    @Column(precision = 19, scale = 2)
    private BigDecimal creditLimit;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VendorStatus status;

    /* Vendor details */
    private String vendorType;
    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    /* Contact details */
    private String designation;
    private String alternatePhone;
    private String contactWebsite;

    /* Address details */
    @Column(name = "address_line_2", columnDefinition = "TEXT")
    private String addressLine2;

    private String country;
    private String state;
    private String pinCode;

    /* Tax details */
    private String gstType;
    private String tan;
    private String cin;
    private String msme;
    private String taxState;

    /* Purchase settings */
    private Integer creditPeriodDays;
    private String currency;

    @Column(precision = 19, scale = 2)
    private BigDecimal minimumOrderValue;

    private Integer deliveryDays;
    private String purchaseCategory;

    /* Bank details */
    private String accountHolder;
    private String bankName;

    /*
     * Encrypt this value before production use.
     * Plain-text account numbers must not be stored in production.
     */
    private String accountNumber;

    private String ifsc;
    private String bankBranch;
    private String accountType;
    private String upiId;

    /* Additional details */
    @Column(length = 1000)
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}