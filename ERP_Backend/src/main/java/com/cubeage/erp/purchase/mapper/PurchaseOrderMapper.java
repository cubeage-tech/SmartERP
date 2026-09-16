package com.cubeage.erp.purchase.mapper;

import com.cubeage.erp.purchase.dto.purchaseorder.PurchaseOrderItemResponse;
import com.cubeage.erp.purchase.dto.purchaseorder.PurchaseOrderResponse;
import com.cubeage.erp.purchase.entity.PurchaseOrder;
import com.cubeage.erp.purchase.entity.PurchaseOrderItem;
import org.springframework.stereotype.Component;

@Component
public class PurchaseOrderMapper {

    public PurchaseOrderResponse toResponse(PurchaseOrder po) {
        return new PurchaseOrderResponse(
                po.getId(),
                po.getTenantId(),
                po.getOrderNumber(),
                po.getVendorId(),
                po.getVendorName(),
                po.getStatus(),
                po.getOrderDate(),
                po.getExpectedDeliveryDate(),
                po.getActualDeliveryDate(),
                po.getDeliveryLocation(),
                po.getPaymentTerms(),
                po.getNotes(),
                po.getSubtotal(),
                po.getTaxAmount(),
                po.getTotalAmount(),
                po.getItems().size(),
                po.getItems().stream().map(this::toItemResponse).toList(),
                po.getCreatedAt(),
                po.getUpdatedAt()
        );
    }

    public PurchaseOrderItemResponse toItemResponse(PurchaseOrderItem item) {
        return new PurchaseOrderItemResponse(
                item.getId(),
                item.getProductId(),
                item.getDescription(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTaxRate(),
                item.getLineTotal()
        );
    }
}