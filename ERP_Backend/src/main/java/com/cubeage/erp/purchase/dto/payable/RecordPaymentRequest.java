package com.cubeage.erp.purchase.dto.payable;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;

public record RecordPaymentRequest(
        @NotNull @Positive BigDecimal amount,
        @NotBlank String paymentReference,
        String paymentMethod,
        Instant paidAt,
        String notes
) {}
