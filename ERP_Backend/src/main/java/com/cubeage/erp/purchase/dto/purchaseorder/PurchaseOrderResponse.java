package com.cubeage.erp.purchase.dto.purchaseorder;

import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record PurchaseOrderResponse(
        Long id,
        Long tenantId,
        String orderNumber,
        Long vendorId,
        String vendorName,
        PurchaseOrderStatus status,
        LocalDate orderDate,
        LocalDate expectedDeliveryDate,
        LocalDate actualDeliveryDate,
        String deliveryLocation,
        String paymentTerms,
        String notes,
        BigDecimal subtotal,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        int itemCount,
        List<PurchaseOrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {}