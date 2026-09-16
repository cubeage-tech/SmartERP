package com.cubeage.erp.purchase.dto.grn;

import com.cubeage.erp.purchase.enums.QualityStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record CreateGoodsReceiptRequest(
        @NotNull Long purchaseOrderId,
        @NotNull Long vendorId,
        @NotBlank String vendorName,
        @NotNull LocalDate receivedDate,
        QualityStatus qualityStatus,
        String notes,
        @NotEmpty List<@Valid GoodsReceiptItemRequest> items
) {}