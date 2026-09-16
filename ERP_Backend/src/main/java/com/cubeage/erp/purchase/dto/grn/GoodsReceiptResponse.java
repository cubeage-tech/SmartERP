package com.cubeage.erp.purchase.dto.grn;

import com.cubeage.erp.purchase.enums.GRNStatus;
import com.cubeage.erp.purchase.enums.QualityStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record GoodsReceiptResponse(
        Long id,
        Long tenantId,
        String grnNumber,
        Long purchaseOrderId,
        Long vendorId,
        String vendorName,
        LocalDate receivedDate,
        GRNStatus status,
        QualityStatus qualityStatus,
        BigDecimal totalValue,
        String notes,
        int itemCount,
        List<GoodsReceiptItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {}