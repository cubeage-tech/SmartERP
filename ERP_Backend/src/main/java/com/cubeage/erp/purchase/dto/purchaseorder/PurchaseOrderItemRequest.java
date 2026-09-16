package com.cubeage.erp.purchase.dto.purchaseorder;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record PurchaseOrderItemRequest(
        Long productId,
        @NotBlank String description,
        @NotNull @Positive BigDecimal quantity,
        @NotNull @PositiveOrZero BigDecimal unitPrice,
        @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal taxRate
) {}