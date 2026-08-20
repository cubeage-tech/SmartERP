package com.cubeage.erp.sales.service;
import com.cubeage.erp.sales.dto.response.InvoiceResponse;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
@Service
public class InvoicePdfService {
 public byte[] generate(InvoiceResponse invoice){String document="INVOICE "+invoice.invoiceNumber()+"\nCustomer: "+invoice.customerName()+"\nIssue date: "+invoice.issueDate()+"\nDue date: "+invoice.dueDate()+"\nTotal: "+invoice.totalAmount()+"\nPaid: "+invoice.paidAmount()+"\nBalance: "+invoice.balanceDue()+"\n";return document.getBytes(StandardCharsets.UTF_8);}
}
