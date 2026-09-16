package com.cubeage.erp.purchase.dto.vendor;

import com.cubeage.erp.purchase.enums.VendorStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record VendorResponse(
        Long id,
        Long tenantId,
        String vendorCode,
        String vendorName,
        String contactName,
        String phone,
        String email,
        String city,
        String address,
        String category,
        String gstin,
        String pan,
        String paymentTerms,
        BigDecimal creditLimit,
        BigDecimal rating,
        VendorStatus status,

        /* Vendor details */
        String vendorType,
        String website,
        String description,

        /* Contact details */
        String designation,
        String alternatePhone,
        String contactWebsite,

        /* Address details */
        String addressLine2,
        String country,
        String state,
        String pinCode,

        /* Tax details */
        String gstType,
        String tan,
        String cin,
        String msme,
        String taxState,

        /* Purchase settings */
        Integer creditPeriodDays,
        String currency,
        BigDecimal minimumOrderValue,
        Integer deliveryDays,
        String purchaseCategory,

        /* Bank details */
        String accountHolder,
        String bankName,
        String accountNumber,
        String ifsc,
        String bankBranch,
        String accountType,
        String upiId,

        /* Additional details */
        String tags,
        String notes,

        Instant createdAt,
        Instant updatedAt
) {}