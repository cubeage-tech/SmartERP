package com.cubeage.erp.sales.event;
import java.time.Instant;
public record InvoiceCreatedEvent(Long tenantId,Long invoiceId,String invoiceNumber,Instant occurredAt) { }
