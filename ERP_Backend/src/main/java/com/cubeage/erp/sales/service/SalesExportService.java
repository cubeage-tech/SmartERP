package com.cubeage.erp.sales.service;

import com.cubeage.erp.sales.dto.response.InvoiceResponse;
import com.cubeage.erp.sales.dto.response.QuotationResponse;
import com.cubeage.erp.sales.dto.response.SalesOrderResponse;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class SalesExportService {

    public byte[] quotationsCsv(List<QuotationResponse> quotations) {
        StringBuilder csv = new StringBuilder(
                "quotationNumber,customer,date,validUntil,itemCount,amount,status\n");
        quotations.forEach(quotation -> csv
                .append(cell(quotation.quotationNumber())).append(',')
                .append(cell(quotation.customerName())).append(',')
                .append(quotation.quotationDate()).append(',')
                .append(quotation.validUntil()).append(',')
                .append(quotation.itemCount()).append(',')
                .append(quotation.totalAmount()).append(',')
                .append(quotation.status()).append('\n'));
        return bytes(csv);
    }

    public byte[] ordersCsv(List<SalesOrderResponse> orders) {
        StringBuilder csv = new StringBuilder(
                "orderNumber,customer,orderDate,deliveryDate,amount,status\n");
        orders.forEach(order -> csv
                .append(cell(order.orderNumber())).append(',')
                .append(cell(order.customerName())).append(',')
                .append(order.orderDate()).append(',')
                .append(order.expectedDeliveryDate()).append(',')
                .append(order.totalAmount()).append(',')
                .append(order.status()).append('\n'));
        return bytes(csv);
    }

    public byte[] invoicesCsv(List<InvoiceResponse> invoices) {
        StringBuilder csv = new StringBuilder(
                "invoiceNumber,customer,status,issueDate,dueDate,total,paid,balance\n");
        invoices.forEach(invoice -> csv
                .append(cell(invoice.invoiceNumber())).append(',')
                .append(cell(invoice.customerName())).append(',')
                .append(invoice.status()).append(',')
                .append(invoice.issueDate()).append(',')
                .append(invoice.dueDate()).append(',')
                .append(invoice.totalAmount()).append(',')
                .append(invoice.paidAmount()).append(',')
                .append(invoice.balanceDue()).append('\n'));
        return bytes(csv);
    }

    private byte[] bytes(StringBuilder csv) {
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String cell(String value) {
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
