package com.cubeage.erp.sales.dto.request;
import com.cubeage.erp.sales.enums.QuotationStatus;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
public record UpdateQuotationRequest(String customerName,LocalDate validUntil,String notes,QuotationStatus status,
                                     @Valid List<CreateQuotationRequest.Item> items) { }
