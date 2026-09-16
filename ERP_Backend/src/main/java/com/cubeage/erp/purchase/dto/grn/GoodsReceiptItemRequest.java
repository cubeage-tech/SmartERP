package com.cubeage.erp.purchase.dto.grn;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record GoodsReceiptItemRequest(
        Long purchaseOrderItemId,
        Long productId,
        @NotBlank String description,
        @NotNull @Positive BigDecimal orderedQuantity,
        @NotNull @Positive BigDecimal receivedQuantity,
        @NotNull @PositiveOrZero BigDecimal unitPrice
) {}