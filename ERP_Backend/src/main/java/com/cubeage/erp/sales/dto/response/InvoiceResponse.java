package com.cubeage.erp.sales.dto.response;
import com.cubeage.erp.sales.enums.InvoiceStatus;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public record InvoiceResponse(Long id,String invoiceNumber,Long salesOrderId,Long customerId,String customerName,
        InvoiceStatus status,LocalDate issueDate,LocalDate dueDate,BigDecimal subtotal,BigDecimal taxAmount,
        BigDecimal totalAmount,BigDecimal paidAmount,BigDecimal balanceDue,List<QuotationResponse.ItemLine> items,Instant createdAt) { }
