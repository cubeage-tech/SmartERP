package com.cubeage.erp.settings.dto.billing;
import com.cubeage.erp.settings.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;
public record BillingHistoryResponse(Long id, String invoiceNumber, BigDecimal amount, String currency,
                                     PaymentStatus status, Instant paidAt, Instant createdAt) { }
