package com.cubeage.erp.purchase.mapper;

import com.cubeage.erp.purchase.dto.grn.GoodsReceiptItemResponse;
import com.cubeage.erp.purchase.dto.grn.GoodsReceiptResponse;
import com.cubeage.erp.purchase.entity.GoodsReceipt;
import com.cubeage.erp.purchase.entity.GoodsReceiptItem;
import org.springframework.stereotype.Component;

@Component
public class GoodsReceiptMapper {

    public GoodsReceiptResponse toResponse(GoodsReceipt grn) {
        return new GoodsReceiptResponse(
                grn.getId(),
                grn.getTenantId(),
                grn.getGrnNumber(),
                grn.getPurchaseOrderId(),
                grn.getVendorId(),
                grn.getVendorName(),
                grn.getReceivedDate(),
                grn.getStatus(),
                grn.getQualityStatus(),
                grn.getTotalValue(),
                grn.getNotes(),
                grn.getItems().size(),
                grn.getItems().stream().map(this::toItemResponse).toList(),
                grn.getCreatedAt(),
                grn.getUpdatedAt()
        );
    }

    public GoodsReceiptItemResponse toItemResponse(GoodsReceiptItem item) {
        return new GoodsReceiptItemResponse(
                item.getId(),
                item.getPurchaseOrderItemId(),
                item.getProductId(),
                item.getDescription(),
                item.getOrderedQuantity(),
                item.getReceivedQuantity(),
                item.getUnitPrice(),
                item.getLineTotal()
        );
    }
}