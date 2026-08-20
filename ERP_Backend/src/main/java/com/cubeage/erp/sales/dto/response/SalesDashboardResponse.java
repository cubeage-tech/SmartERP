package com.cubeage.erp.sales.dto.response;
import java.math.BigDecimal;

public record SalesDashboardResponse(
        BigDecimal revenueMtd,
        BigDecimal revenueChangePercent,
        BigDecimal outstandingAmount,
        long pendingInvoiceCount,
        BigDecimal ordersYtdAmount,
        long orderCountYtd,
        BigDecimal onTimeDeliveryPercentage,
        BigDecimal onTimeDeliveryChangePoints,
        String currency
) { }
