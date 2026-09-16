package com.cubeage.erp.purchase.mapper;

import com.cubeage.erp.purchase.dto.payable.PayableResponse;
import com.cubeage.erp.purchase.entity.Payable;
import org.springframework.stereotype.Component;

@Component
public class PayableMapper {

    public PayableResponse toResponse(Payable p) {
        return new PayableResponse(
                p.getId(),
                p.getTenantId(),
                p.getPurchaseOrderId(),
                p.getVendorId(),
                p.getVendorName(),
                p.getInvoiceReference(),
                p.getInvoiceDate(),
                p.getDueDate(),
                p.getTotalAmount(),
                p.getPaidAmount(),
                p.getBalanceDue(),
                p.getStatus(),
                p.getPaymentReference(),
                p.getPaidAt(),
                p.getNotes(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}