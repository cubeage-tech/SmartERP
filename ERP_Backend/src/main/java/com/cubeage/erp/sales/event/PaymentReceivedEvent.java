package com.cubeage.erp.sales.event;
import java.math.BigDecimal;
import java.time.Instant;
public record PaymentReceivedEvent(Long tenantId,Long invoiceId,Long paymentId,BigDecimal amount,Instant occurredAt) { }
