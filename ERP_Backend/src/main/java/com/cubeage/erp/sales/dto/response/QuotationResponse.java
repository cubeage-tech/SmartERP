package com.cubeage.erp.sales.dto.response;
import com.cubeage.erp.sales.enums.QuotationStatus;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public record QuotationResponse(Long id,String quotationNumber,Long customerId,String customerName,QuotationStatus status,
        LocalDate quotationDate,LocalDate validUntil,BigDecimal subtotal,BigDecimal taxAmount,BigDecimal totalAmount,
        String notes,int itemCount,List<ItemLine> items,Instant createdAt,Instant updatedAt) {
 public record ItemLine(Long id,Long productId,String description,BigDecimal quantity,BigDecimal unitPrice,BigDecimal taxRate,BigDecimal lineTotal) { }
}
