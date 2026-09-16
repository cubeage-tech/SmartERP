package com.cubeage.erp.purchase.dto.payable;

import com.cubeage.erp.purchase.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record PayableResponse(
        Long id,
        Long tenantId,
        Long purchaseOrderId,
        Long vendorId,
        String vendorName,
        String invoiceReference,
        LocalDate invoiceDate,
        LocalDate dueDate,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal balanceDue,
        PaymentStatus status,
        String paymentReference,
        Instant paidAt,
        String notes,
        Instant createdAt,
        Instant updatedAt
) {
    public record CreatePayableRequest(
            @NotNull Long purchaseOrderId,
            @NotBlank String invoiceReference,
            @NotNull LocalDate invoiceDate,
            @NotNull @FutureOrPresent LocalDate dueDate,
            @NotNull @DecimalMin("0.01") BigDecimal totalAmount,
            String notes
    ) {}
}