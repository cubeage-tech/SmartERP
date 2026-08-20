package com.cubeage.erp.sales.dto.request;

import com.cubeage.erp.sales.enums.SalesOrderStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateSalesOrderStatusRequest(
        @NotNull SalesOrderStatus status,
        LocalDate actualDeliveryDate
) { }
