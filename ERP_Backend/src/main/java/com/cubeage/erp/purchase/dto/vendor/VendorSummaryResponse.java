package com.cubeage.erp.purchase.dto.vendor;

import com.cubeage.erp.purchase.enums.VendorStatus;

import java.math.BigDecimal;

public record VendorSummaryResponse(
        Long id,
        String vendorCode,
        String vendorName,
        String contactName,
        String city,
        String category,
        BigDecimal creditLimit,
        BigDecimal rating,
        VendorStatus status
) {}