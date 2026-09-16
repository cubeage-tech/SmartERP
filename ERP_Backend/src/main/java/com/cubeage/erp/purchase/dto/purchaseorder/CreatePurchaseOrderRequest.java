package com.cubeage.erp.purchase.dto.purchaseorder;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CreatePurchaseOrderRequest(
        @NotNull Long vendorId,
        @NotBlank String vendorName,
        @FutureOrPresent LocalDate expectedDeliveryDate,
        String deliveryLocation,
        String paymentTerms,
        String notes,
        @NotEmpty List<@Valid PurchaseOrderItemRequest> items
) {
    public record Item(
            Long productId,
            @NotBlank String description,
            @NotNull @Positive BigDecimal quantity,
            @NotNull @PositiveOrZero BigDecimal unitPrice,
            @NotNull @DecimalMin("0.0") @DecimalMax("100.0") BigDecimal taxRate
    ) {}
}