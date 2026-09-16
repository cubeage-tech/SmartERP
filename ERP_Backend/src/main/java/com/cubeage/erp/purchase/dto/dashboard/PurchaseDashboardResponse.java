package com.cubeage.erp.purchase.dto.dashboard;

import java.math.BigDecimal;

public record PurchaseDashboardResponse(
        BigDecimal purchaseMtd,
        BigDecimal purchaseChangePercent,
        BigDecimal totalPayables,
        long pendingPayableCount,
        long activeVendorCount,
        BigDecimal onTimeReceiptPercentage,
        BigDecimal onTimeReceiptChangePoints,
        String currency
) {}