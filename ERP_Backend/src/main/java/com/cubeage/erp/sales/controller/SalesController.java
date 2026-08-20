package com.cubeage.erp.sales.controller;

import com.cubeage.erp.sales.dto.request.CreateQuotationRequest;
import com.cubeage.erp.sales.dto.request.PaymentRequest;
import com.cubeage.erp.sales.dto.request.UpdateQuotationRequest;
import com.cubeage.erp.sales.dto.request.UpdateSalesOrderStatusRequest;
import com.cubeage.erp.sales.dto.response.InvoiceResponse;
import com.cubeage.erp.sales.dto.response.QuotationResponse;
import com.cubeage.erp.sales.dto.response.SalesAnalyticsResponse;
import com.cubeage.erp.sales.dto.response.SalesDashboardResponse;
import com.cubeage.erp.sales.dto.response.SalesOrderResponse;
import com.cubeage.erp.sales.enums.SalesExportType;
import com.cubeage.erp.sales.service.InvoicePdfService;
import com.cubeage.erp.sales.service.SalesExportService;
import com.cubeage.erp.sales.service.SalesService;
import com.cubeage.erp.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@PreAuthorize("@permissionEvaluator.has(authentication,'SALES','VIEW')")
public class SalesController {

    private final SalesService service;
    private final InvoicePdfService pdfService;
    private final SalesExportService exportService;

    @GetMapping({"", "/dashboard"})
    public SalesDashboardResponse dashboard() {
        return service.dashboard(SecurityUtils.currentTenantId());
    }

    @PostMapping({"", "/quotations"})
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','CREATE')")
    public ResponseEntity<QuotationResponse> create(
            @Valid @RequestBody CreateQuotationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createQuotation(SecurityUtils.currentTenantId(), request));
    }

    @GetMapping("/quotations")
    public List<QuotationResponse> quotations() {
        return service.quotations(SecurityUtils.currentTenantId());
    }

    @GetMapping("/quotations/{id}")
    public QuotationResponse quotation(@PathVariable Long id) {
        return service.quotation(SecurityUtils.currentTenantId(), id);
    }

    @PutMapping("/quotations/{id}")
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','EDIT')")
    public QuotationResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuotationRequest request
    ) {
        return service.updateQuotation(SecurityUtils.currentTenantId(), id, request);
    }

    @PostMapping("/quotations/{id}/convert")
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','CREATE')")
    public SalesOrderResponse convert(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate expectedDeliveryDate
    ) {
        return service.convertToOrder(
                SecurityUtils.currentTenantId(), id, expectedDeliveryDate);
    }

    @GetMapping("/orders")
    public List<SalesOrderResponse> orders() {
        return service.orders(SecurityUtils.currentTenantId());
    }

    @GetMapping("/orders/{id}")
    public SalesOrderResponse order(@PathVariable Long id) {
        return service.order(SecurityUtils.currentTenantId(), id);
    }

    @PatchMapping("/orders/{id}/status")
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','EDIT')")
    public SalesOrderResponse updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSalesOrderStatusRequest request
    ) {
        return service.updateOrderStatus(SecurityUtils.currentTenantId(), id, request);
    }

    @PostMapping("/orders/{id}/invoice")
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','CREATE')")
    public ResponseEntity<InvoiceResponse> invoiceOrder(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate dueDate
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createInvoice(SecurityUtils.currentTenantId(), id, dueDate));
    }

    @GetMapping("/invoices")
    public List<InvoiceResponse> invoices() {
        return service.invoices(SecurityUtils.currentTenantId());
    }

    @GetMapping("/invoices/{id}")
    public InvoiceResponse invoice(@PathVariable Long id) {
        return service.invoice(SecurityUtils.currentTenantId(), id);
    }

    @PostMapping("/invoices/{id}/payments")
    @PreAuthorize("@permissionEvaluator.has(authentication,'SALES','EDIT')")
    public InvoiceResponse payment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request
    ) {
        return service.recordPayment(SecurityUtils.currentTenantId(), id, request);
    }

    @GetMapping(value = "/invoices/{id}/print", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<byte[]> print(@PathVariable Long id) {
        InvoiceResponse invoice = service.invoice(SecurityUtils.currentTenantId(), id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + invoice.invoiceNumber() + ".txt\"")
                .body(pdfService.generate(invoice));
    }

    @GetMapping(value = "/invoices/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportInvoices() {
        return csv("sales-invoices.csv", exportService.invoicesCsv(
                service.invoices(SecurityUtils.currentTenantId())));
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> export(@RequestParam SalesExportType type) {
        Long tenantId = SecurityUtils.currentTenantId();
        return switch (type) {
            case QUOTATIONS -> csv("sales-quotations.csv",
                    exportService.quotationsCsv(service.quotations(tenantId)));
            case ORDERS -> csv("sales-orders.csv",
                    exportService.ordersCsv(service.orders(tenantId)));
            case INVOICES -> csv("sales-invoices.csv",
                    exportService.invoicesCsv(service.invoices(tenantId)));
        };
    }

    @GetMapping("/analytics")
    public SalesAnalyticsResponse analytics() {
        return service.analytics(SecurityUtils.currentTenantId());
    }

    private ResponseEntity<byte[]> csv(String fileName, byte[] content) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .body(content);
    }
}
