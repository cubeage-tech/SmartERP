package com.cubeage.erp.sales.dto.response;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public record SalesAnalyticsResponse(
        List<MonthlyRevenue> monthlyRevenue,
        List<TopCustomer> topCustomers,
        String currency
) {
    public record MonthlyRevenue(
            YearMonth month,
            BigDecimal amount
    ) { }

    public record TopCustomer(
            int rank,
            Long customerId,
            String customerName,
            BigDecimal amount
    ) { }
}
