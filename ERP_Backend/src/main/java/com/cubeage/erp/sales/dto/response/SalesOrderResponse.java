package com.cubeage.erp.sales.dto.response;
import com.cubeage.erp.sales.enums.SalesOrderStatus;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public record SalesOrderResponse(Long id,String orderNumber,Long quotationId,Long customerId,String customerName,
        SalesOrderStatus status,LocalDate orderDate,LocalDate expectedDeliveryDate,LocalDate actualDeliveryDate,BigDecimal subtotal,
        BigDecimal taxAmount,BigDecimal totalAmount,List<QuotationResponse.ItemLine> items,Instant createdAt) { }
