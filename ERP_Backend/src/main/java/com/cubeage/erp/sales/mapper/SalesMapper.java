package com.cubeage.erp.sales.mapper;
import com.cubeage.erp.sales.dto.response.*;
import com.cubeage.erp.sales.entity.*;
import org.springframework.stereotype.Component;
@Component
public class SalesMapper {
 public QuotationResponse quotation(Quotation q){return new QuotationResponse(q.getId(),q.getQuotationNumber(),q.getCustomerId(),q.getCustomerName(),q.getStatus(),q.getQuotationDate(),q.getValidUntil(),q.getSubtotal(),q.getTaxAmount(),q.getTotalAmount(),q.getNotes(),q.getItems().size(),q.getItems().stream().map(i->line(i.getId(),i.getProductId(),i.getDescription(),i.getQuantity(),i.getUnitPrice(),i.getTaxRate(),i.getLineTotal())).toList(),q.getCreatedAt(),q.getUpdatedAt());}
 public SalesOrderResponse order(SalesOrder o){return new SalesOrderResponse(o.getId(),o.getOrderNumber(),o.getQuotationId(),o.getCustomerId(),o.getCustomerName(),o.getStatus(),o.getOrderDate(),o.getExpectedDeliveryDate(),o.getActualDeliveryDate(),o.getSubtotal(),o.getTaxAmount(),o.getTotalAmount(),o.getItems().stream().map(i->line(i.getId(),i.getProductId(),i.getDescription(),i.getQuantity(),i.getUnitPrice(),i.getTaxRate(),i.getLineTotal())).toList(),o.getCreatedAt());}
 public InvoiceResponse invoice(Invoice i){return new InvoiceResponse(i.getId(),i.getInvoiceNumber(),i.getSalesOrderId(),i.getCustomerId(),i.getCustomerName(),i.getStatus(),i.getIssueDate(),i.getDueDate(),i.getSubtotal(),i.getTaxAmount(),i.getTotalAmount(),i.getPaidAmount(),i.getBalanceDue(),i.getItems().stream().map(x->line(x.getId(),x.getProductId(),x.getDescription(),x.getQuantity(),x.getUnitPrice(),x.getTaxRate(),x.getLineTotal())).toList(),i.getCreatedAt());}
 private QuotationResponse.ItemLine line(Long id,Long productId,String description,java.math.BigDecimal quantity,java.math.BigDecimal unitPrice,java.math.BigDecimal taxRate,java.math.BigDecimal total){return new QuotationResponse.ItemLine(id,productId,description,quantity,unitPrice,taxRate,total);}
}
