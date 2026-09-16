package com.cubeage.erp.reports.service.impl;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.reports.dto.custom.PreviewDataResponse;
import com.cubeage.erp.reports.dto.export.ReportExportRequest;
import com.cubeage.erp.reports.entity.Report;
import com.cubeage.erp.reports.enums.ReportFormat;
import com.cubeage.erp.reports.generator.CsvReportGenerator;
import com.cubeage.erp.reports.generator.ExcelReportGenerator;
import com.cubeage.erp.reports.generator.PdfReportGenerator;
import com.cubeage.erp.reports.repository.ReportRepository;
import com.cubeage.erp.reports.service.CustomReportService;
import com.cubeage.erp.reports.service.ReportExportService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportExportServiceImpl implements ReportExportService {

    private final ReportRepository reportRepository;
    private final CustomReportService customReportService;

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    public ResponseEntity<byte[]> exportReport(Long tenantId, Long id, ReportExportRequest r) {
        String title;
        List<String> columns;
        List<Map<String, Object>> data;

        if (r.isCustom()) {
            // 1. Fetch custom report config and run preview dynamic query
            var cr = customReportService.get(tenantId, id);
            title = cr.name();
            PreviewDataResponse preview = customReportService.getPreview(tenantId, id);
            columns = preview.columns();
            data = preview.data();
        } else {
            // 2. Fetch standard report template
            Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Standard report template not found with id: " + id));
            title = report.getName();

            // Run real tenant-scoped queries
            PreviewDataResponse preview = runStandardReportQuery(tenantId, report);
            columns = preview.columns();
            data = preview.data();
        }

        // 3. Generate bytes based on requested format
        byte[] fileBytes;
        String filename = title.toLowerCase().replaceAll("[^a-z0-9]", "-");
        MediaType mediaType;

        if (r.format() == ReportFormat.PDF) {
            fileBytes = PdfReportGenerator.generatePdf(title, columns, data);
            filename += ".pdf";
            mediaType = MediaType.APPLICATION_PDF;
        } else if (r.format() == ReportFormat.EXCEL) {
            fileBytes = ExcelReportGenerator.generateExcel(title, columns, data);
            filename += ".xls";
            mediaType = MediaType.parseMediaType("application/vnd.ms-excel");
        } else if (r.format() == ReportFormat.CSV) {
            fileBytes = CsvReportGenerator.generateCsv(columns, data);
            filename += ".csv";
            mediaType = MediaType.parseMediaType("text/csv");
        } else {
            throw new IllegalArgumentException("Unsupported report format: " + r.format());
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(mediaType)
            .body(fileBytes);
    }

    private PreviewDataResponse runStandardReportQuery(Long tenantId, Report report) {
        String reportName = report.getName();
        List<String> cols = new ArrayList<>();
        List<Map<String, Object>> rows = new ArrayList<>();

        if ("Sales Summary".equalsIgnoreCase(reportName) || "Sales Performance Report".equalsIgnoreCase(reportName)) {
            cols = List.of("Order Number", "Customer Name", "Order Date", "Subtotal", "Tax Amount", "Total Amount", "Status");
            try {
                List<Object[]> results = entityManager.createQuery(
                    "SELECT so.orderNumber, so.customerName, so.orderDate, so.subtotal, so.taxAmount, so.totalAmount, so.status " +
                    "FROM SalesOrder so WHERE so.tenantId = :tenantId ORDER BY so.orderDate DESC",
                    Object[].class
                ).setParameter("tenantId", tenantId).getResultList();

                for (Object[] r : results) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("Order Number", r[0] != null ? r[0].toString() : "");
                    map.put("Customer Name", r[1] != null ? r[1].toString() : "");
                    map.put("Order Date", r[2] != null ? r[2].toString() : "");
                    map.put("Subtotal", r[3] != null ? r[3].toString() : "0.00");
                    map.put("Tax Amount", r[4] != null ? r[4].toString() : "0.00");
                    map.put("Total Amount", r[5] != null ? r[5].toString() : "0.00");
                    map.put("Status", r[6] != null ? r[6].toString() : "");
                    rows.add(map);
                }
            } catch (Exception e) {
                System.err.println("Failed to query Sales Summary: " + e.getMessage());
            }
        } else if ("Inventory Valuation".equalsIgnoreCase(reportName)) {
            cols = List.of("SKU", "Item Name", "Category", "Warehouse", "Quantity", "Cost Price", "Total Value", "Unit");
            try {
                List<Object[]> results = entityManager.createQuery(
                    "SELECT ii.sku, ii.name, ii.category, ii.warehouseName, ii.quantity, ii.costPrice, (ii.quantity * ii.costPrice), ii.unit " +
                    "FROM InventoryItem ii WHERE ii.tenantId = :tenantId ORDER BY ii.name ASC",
                    Object[].class
                ).setParameter("tenantId", tenantId).getResultList();

                for (Object[] r : results) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("SKU", r[0] != null ? r[0].toString() : "");
                    map.put("Item Name", r[1] != null ? r[1].toString() : "");
                    map.put("Category", r[2] != null ? r[2].toString() : "");
                    map.put("Warehouse", r[3] != null ? r[3].toString() : "");
                    map.put("Quantity", r[4] != null ? r[4].toString() : "0");
                    map.put("Cost Price", r[5] != null ? r[5].toString() : "0.00");
                    map.put("Total Value", r[6] != null ? r[6].toString() : "0.00");
                    map.put("Unit", r[7] != null ? r[7].toString() : "");
                    rows.add(map);
                }
            } catch (Exception e) {
                System.err.println("Failed to query Inventory Valuation: " + e.getMessage());
            }
        } else if ("Production Quality Logs".equalsIgnoreCase(reportName)) {
            cols = List.of("Work Order", "Product Name", "Inspection Type", "Result", "Quantity", "Inspector Name", "Reason");
            try {
                List<Object[]> results = entityManager.createQuery(
                    "SELECT qi.workOrderNumber, qi.productName, qi.type, qi.result, qi.quantity, qi.inspectorName, qi.reason " +
                    "FROM QualityInspection qi WHERE qi.tenantId = :tenantId ORDER BY qi.id DESC",
                    Object[].class
                ).setParameter("tenantId", tenantId).getResultList();

                for (Object[] r : results) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("Work Order", r[0] != null ? r[0].toString() : "");
                    map.put("Product Name", r[1] != null ? r[1].toString() : "");
                    map.put("Inspection Type", r[2] != null ? r[2].toString() : "");
                    map.put("Result", r[3] != null ? r[3].toString() : "");
                    map.put("Quantity", r[4] != null ? r[4].toString() : "0");
                    map.put("Inspector Name", r[5] != null ? r[5].toString() : "");
                    map.put("Reason", r[6] != null ? r[6].toString() : "");
                    rows.add(map);
                }
            } catch (Exception e) {
                System.err.println("Failed to query Production Quality Logs: " + e.getMessage());
            }
        } else if ("Project Budget Variance".equalsIgnoreCase(reportName)) {
            cols = List.of("Project Code", "Project Name", "Start Date", "End Date", "Planned Budget", "Actual Budget", "Variance", "Status");
            try {
                List<Object[]> results = entityManager.createQuery(
                    "SELECT p.projectCode, p.name, p.startDate, p.endDate, p.plannedBudget, p.actualBudget, (p.plannedBudget - p.actualBudget), p.status " +
                    "FROM Project p WHERE p.tenantId = :tenantId ORDER BY p.name ASC",
                    Object[].class
                ).setParameter("tenantId", tenantId).getResultList();

                for (Object[] r : results) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("Project Code", r[0] != null ? r[0].toString() : "");
                    map.put("Project Name", r[1] != null ? r[1].toString() : "");
                    map.put("Start Date", r[2] != null ? r[2].toString() : "");
                    map.put("End Date", r[3] != null ? r[3].toString() : "");
                    map.put("Planned Budget", r[4] != null ? r[4].toString() : "0.00");
                    map.put("Actual Budget", r[5] != null ? r[5].toString() : "0.00");
                    map.put("Variance", r[6] != null ? r[6].toString() : "0.00");
                    map.put("Status", r[7] != null ? r[7].toString() : "");
                    rows.add(map);
                }
            } catch (Exception e) {
                System.err.println("Failed to query Project Budget Variance: " + e.getMessage());
            }
        } else if ("Employee Attendance Summary".equalsIgnoreCase(reportName) || "Attendance Summary".equalsIgnoreCase(reportName)) {
            cols = List.of("User / Employee", "Email", "Role", "Department", "Status");
        } else if ("Vendor Performance Report".equalsIgnoreCase(reportName)) {
            cols = List.of("Vendor Name", "Contact", "Rating", "Total Orders", "Status");
        } else if ("Balance Sheet".equalsIgnoreCase(reportName)) {
            cols = List.of("Account Code", "Account Name", "Category", "Debit", "Credit", "Balance");
        } else {
            cols = List.of("Record ID", "Name", "Date", "Category", "Status");
        }

        return new PreviewDataResponse(cols, rows, rows.size());
    }
}
