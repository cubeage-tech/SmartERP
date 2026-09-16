package com.cubeage.erp.purchase.dto.grn;

import java.math.BigDecimal;

public record GoodsReceiptItemResponse(
        Long id,
        Long purchaseOrderItemId,
        Long productId,
        String description,
        BigDecimal orderedQuantity,
        BigDecimal receivedQuantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}