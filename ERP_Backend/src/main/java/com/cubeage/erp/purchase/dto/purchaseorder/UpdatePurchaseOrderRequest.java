package com.cubeage.erp.purchase.dto.purchaseorder;

import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

public record UpdatePurchaseOrderRequest(
        PurchaseOrderStatus status,
        LocalDate expectedDeliveryDate,
        LocalDate actualDeliveryDate,
        String deliveryLocation,
        String paymentTerms,
        String notes,
        List<@Valid PurchaseOrderItemRequest> items
) {}
