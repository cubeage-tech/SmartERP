package com.cubeage.erp.purchase.dto.vendor;

import com.cubeage.erp.purchase.enums.VendorStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record VendorRequest(
        @NotBlank String vendorName,
        @NotBlank String contactName,

        String phone,

        @Email
        String email,

        String city,
        String address,
        String category,
        String gstin,
        String pan,
        String paymentTerms,

        @PositiveOrZero
        BigDecimal creditLimit,

        @DecimalMin("0.0")
        @DecimalMax("5.0")
        BigDecimal rating,

        @NotNull
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
        @PositiveOrZero
        Integer creditPeriodDays,

        String currency,

        @PositiveOrZero
        BigDecimal minimumOrderValue,

        @PositiveOrZero
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
        String notes
) {}