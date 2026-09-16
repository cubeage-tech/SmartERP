package com.cubeage.erp.reports.service.impl;

import com.cubeage.erp.reports.dto.dashboard.*;
import com.cubeage.erp.reports.dto.report.ReportResponse;
import com.cubeage.erp.reports.entity.CustomReport;
import com.cubeage.erp.reports.enums.ReportFrequency;
import com.cubeage.erp.reports.mapper.ReportMapper;
import com.cubeage.erp.reports.repository.CustomReportRepository;
import com.cubeage.erp.reports.repository.ReportRepository;
import com.cubeage.erp.reports.service.ReportDashboardService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportDashboardServiceImpl implements ReportDashboardService {

    private final ReportRepository reportRepository;
    private final CustomReportRepository customReportRepository;
    private final ReportMapper reportMapper;

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public ReportDashboardResponse getDashboardData(Long tenantId) {
        // Fetch standard reports & custom reports
        List<ReportResponse> reports = new ArrayList<>(
            reportRepository.findByTenantId(tenantId).stream().map(reportMapper::toResponse).toList()
        );
        
        List<CustomReport> customs = customReportRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        for (CustomReport cr : customs) {
            reports.add(new ReportResponse(
                cr.getId(),
                cr.getName(),
                cr.getModule(),
                "PDF, Excel, CSV",
                cr.getCreatedAt(),
                cr.getSchedEnabled() ? ReportFrequency.WEEKLY : ReportFrequency.NONE,
                cr.getStatus(),
                true
            ));
        }

        // 3. Compute KPI Metrics
        Map<String, List<KpiResponse>> kpiData = new LinkedHashMap<>();
        kpiData.put("FINANCE", getFinanceKpis(tenantId));
        kpiData.put("SALES", getSalesKpis(tenantId));
        kpiData.put("OPERATIONS", getOperationsKpis(tenantId));
        kpiData.put("INVENTORY", getInventoryKpis(tenantId));
        kpiData.put("HR", getHrKpis(tenantId));

        // 4. Compute Revenue Trend
        List<RevenueTrendResponse> revenueTrend = getRevenueTrend(tenantId);

        // 5. Compute Revenue Split
        List<RevenueSplitResponse> revenueSplit = getRevenueSplit(tenantId);

        return new ReportDashboardResponse(kpiData, revenueTrend, revenueSplit, reports);
    }

    private List<KpiResponse> getFinanceKpis(Long tenantId) {
        BigDecimal totalRevenue = BigDecimal.ZERO;
        try {
            totalRevenue = entityManager.createQuery(
                "SELECT COALESCE(SUM(so.totalAmount), 0) FROM SalesOrder so WHERE so.tenantId = :tenantId",
                BigDecimal.class
            ).setParameter("tenantId", tenantId).getSingleResult();
        } catch (Exception e) {
            System.err.println("Failed to fetch SalesOrder total sum: " + e.getMessage());
        }

        String revValue = formatCurrency(totalRevenue);

        return List.of(
            new KpiResponse("REVENUE YTD", revValue, "—", "neutral"),
            new KpiResponse("EXPENSES MTD", "₹0", "—", "neutral"),
            new KpiResponse("PROFIT MARGIN", totalRevenue.compareTo(BigDecimal.ZERO) > 0 ? "100.0%" : "0%", "—", "neutral")
        );
    }

    private List<KpiResponse> getSalesKpis(Long tenantId) {
        long orderCount = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        try {
            orderCount = entityManager.createQuery(
                "SELECT COUNT(so) FROM SalesOrder so WHERE so.tenantId = :tenantId",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();

            totalRevenue = entityManager.createQuery(
                "SELECT COALESCE(SUM(so.totalAmount), 0) FROM SalesOrder so WHERE so.tenantId = :tenantId",
                BigDecimal.class
            ).setParameter("tenantId", tenantId).getSingleResult();
        } catch (Exception e) {
            System.err.println("Failed to fetch sales order metrics: " + e.getMessage());
        }

        BigDecimal aov = orderCount > 0 
            ? totalRevenue.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP) 
            : BigDecimal.ZERO;
        String aovStr = formatCurrency(aov);

        long totalQuotations = 0;
        long convertedQuotations = 0;
        try {
            totalQuotations = entityManager.createQuery(
                "SELECT COUNT(q) FROM Quotation q WHERE q.tenantId = :tenantId",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();

            convertedQuotations = entityManager.createQuery(
                "SELECT COUNT(DISTINCT so.quotationId) FROM SalesOrder so WHERE so.tenantId = :tenantId AND so.quotationId IS NOT NULL",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();
        } catch (Exception e) {
            System.err.println("Failed to fetch quotation metrics: " + e.getMessage());
        }

        String winRateStr = totalQuotations > 0 
            ? String.format(Locale.ENGLISH, "%.1f%%", (convertedQuotations * 100.0) / totalQuotations) 
            : "0%";

        return List.of(
            new KpiResponse("TOTAL ORDERS", String.valueOf(orderCount), "—", "neutral"),
            new KpiResponse("AVG ORDER VALUE", aovStr, "—", "neutral"),
            new KpiResponse("SALES CONVERSION", winRateStr, "—", "neutral")
        );
    }

    private List<KpiResponse> getInventoryKpis(Long tenantId) {
        BigDecimal stockVal = BigDecimal.ZERO;
        long lowStockCount = 0;
        try {
            stockVal = entityManager.createQuery(
                "SELECT COALESCE(SUM(ii.quantity * ii.costPrice), 0) FROM InventoryItem ii WHERE ii.tenantId = :tenantId",
                BigDecimal.class
            ).setParameter("tenantId", tenantId).getSingleResult();

            lowStockCount = entityManager.createQuery(
                "SELECT COUNT(ii) FROM InventoryItem ii WHERE ii.tenantId = :tenantId AND ii.quantity <= ii.minimumLevel",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();
        } catch (Exception e) {
            System.err.println("Failed to query inventory metrics: " + e.getMessage());
        }

        String stockStr = formatCurrency(stockVal);

        return List.of(
            new KpiResponse("STOCK VALUE", stockStr, "—", "neutral"),
            new KpiResponse("LOW STOCK ITEMS", lowStockCount + " items", "—", "neutral"),
            new KpiResponse("TURNOVER RATIO", "N/A", "—", "neutral")
        );
    }

    private List<KpiResponse> getOperationsKpis(Long tenantId) {
        double avgUtilization = 0.0;
        long totalMachines = 0;
        try {
            totalMachines = entityManager.createQuery(
                "SELECT COUNT(m) FROM Machine m WHERE m.tenantId = :tenantId",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();

            if (totalMachines > 0) {
                Double avg = entityManager.createQuery(
                    "SELECT AVG(m.utilization) FROM Machine m WHERE m.tenantId = :tenantId",
                    Double.class
                ).setParameter("tenantId", tenantId).getSingleResult();
                avgUtilization = avg != null ? avg : 0.0;
            }
        } catch (Exception e) {
            System.err.println("Failed to query machine utilization: " + e.getMessage());
        }

        String oeeStr = totalMachines > 0 
            ? String.format(Locale.ENGLISH, "%.1f%%", avgUtilization) 
            : "0%";

        long totalInspections = 0;
        long rejectedCount = 0;
        try {
            totalInspections = entityManager.createQuery(
                "SELECT COUNT(qi) FROM QualityInspection qi WHERE qi.tenantId = :tenantId",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();

            if (totalInspections > 0) {
                rejectedCount = entityManager.createQuery(
                    "SELECT COUNT(qi) FROM QualityInspection qi WHERE qi.tenantId = :tenantId AND qi.result = com.cubeage.erp.manufacturing.enums.QualityResult.REJECT",
                    Long.class
                ).setParameter("tenantId", tenantId).getSingleResult();
            }
        } catch (Exception e) {
            System.err.println("Failed to query quality inspection metrics: " + e.getMessage());
        }

        String rejectionStr = totalInspections > 0 
            ? String.format(Locale.ENGLISH, "%.1f%%", (rejectedCount * 100.0) / totalInspections) 
            : "0%";

        return List.of(
            new KpiResponse("OEE", oeeStr, "—", "neutral"),
            new KpiResponse("REJECTION RATE", rejectionStr, "—", "neutral"),
            new KpiResponse("ON-TIME DELIVERY", "N/A", "—", "neutral")
        );
    }

    private List<KpiResponse> getHrKpis(Long tenantId) {
        long userCount = 0;
        try {
            userCount = entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.tenantId = :tenantId AND u.active = true",
                Long.class
            ).setParameter("tenantId", tenantId).getSingleResult();
        } catch (Exception e) {
            System.err.println("Failed to query user headcount: " + e.getMessage());
        }

        return List.of(
            new KpiResponse("HEADCOUNT", String.valueOf(userCount), "—", "neutral"),
            new KpiResponse("TURNOVER RATE", "N/A", "—", "neutral"),
            new KpiResponse("TRAINING HOURS", "0 hrs", "—", "neutral")
        );
    }

    private List<RevenueTrendResponse> getRevenueTrend(Long tenantId) {
        List<RevenueTrendResponse> trend = new ArrayList<>();
        List<Object[]> orders = new ArrayList<>();
        try {
            orders = entityManager.createQuery(
                "SELECT so.orderDate, so.totalAmount FROM SalesOrder so WHERE so.tenantId = :tenantId AND so.orderDate >= :startDate",
                Object[].class
            )
            .setParameter("tenantId", tenantId)
            .setParameter("startDate", LocalDate.now().minusMonths(6).withDayOfMonth(1))
            .getResultList();
        } catch (Exception e) {
            System.err.println("Failed to fetch order list for trend: " + e.getMessage());
        }

        if (orders.isEmpty()) {
            return List.of();
        }

        Map<String, BigDecimal> monthlyTotals = new LinkedHashMap<>();
        // Pre-fill last 6 months
        for (int i = 5; i >= 0; i--) {
            String month = LocalDate.now().minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyTotals.put(month, BigDecimal.ZERO);
        }

        for (Object[] row : orders) {
            LocalDate date = (LocalDate) row[0];
            BigDecimal val = (BigDecimal) row[1];
            String month = date.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            if (monthlyTotals.containsKey(month)) {
                monthlyTotals.put(month, monthlyTotals.get(month).add(val));
            }
        }

        for (Map.Entry<String, BigDecimal> entry : monthlyTotals.entrySet()) {
            trend.add(new RevenueTrendResponse(entry.getKey(), entry.getValue()));
        }

        return trend;
    }

    private List<RevenueSplitResponse> getRevenueSplit(Long tenantId) {
        List<Object[]> queryResults = new ArrayList<>();
        try {
            queryResults = entityManager.createQuery(
                "SELECT so.customerName, COALESCE(SUM(so.totalAmount), 0) FROM SalesOrder so WHERE so.tenantId = :tenantId GROUP BY so.customerName",
                Object[].class
            )
            .setParameter("tenantId", tenantId)
            .setMaxResults(5) // Top 5 customers
            .getResultList();
        } catch (Exception e) {
            System.err.println("Failed to fetch split: " + e.getMessage());
        }

        if (queryResults.isEmpty()) {
            return List.of();
        }

        List<RevenueSplitResponse> split = new ArrayList<>();
        for (Object[] row : queryResults) {
            split.add(new RevenueSplitResponse((String) row[0], (BigDecimal) row[1]));
        }
        return split;
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return "₹0";
        }
        if (amount.compareTo(BigDecimal.valueOf(10000000)) >= 0) {
            return "₹" + amount.divide(BigDecimal.valueOf(10000000), 2, RoundingMode.HALF_UP).toString() + " Cr";
        }
        if (amount.compareTo(BigDecimal.valueOf(100000)) >= 0) {
            return "₹" + amount.divide(BigDecimal.valueOf(100000), 2, RoundingMode.HALF_UP).toString() + " L";
        }
        return "₹" + amount.setScale(2, RoundingMode.HALF_UP).toString();
    }
}
