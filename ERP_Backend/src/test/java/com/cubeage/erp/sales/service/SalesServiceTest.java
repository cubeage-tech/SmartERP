package com.cubeage.erp.sales.service;

import com.cubeage.erp.sales.dto.request.CreateQuotationRequest;
import com.cubeage.erp.sales.dto.request.PaymentRequest;
import com.cubeage.erp.sales.dto.request.UpdateSalesOrderStatusRequest;
import com.cubeage.erp.sales.dto.response.QuotationResponse;
import com.cubeage.erp.sales.dto.response.SalesAnalyticsResponse;
import com.cubeage.erp.sales.entity.Invoice;
import com.cubeage.erp.sales.entity.SalesOrder;
import com.cubeage.erp.sales.enums.InvoiceStatus;
import com.cubeage.erp.sales.enums.PaymentMethod;
import com.cubeage.erp.sales.enums.SalesDocumentType;
import com.cubeage.erp.sales.enums.SalesOrderStatus;
import com.cubeage.erp.sales.mapper.SalesMapper;
import com.cubeage.erp.sales.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SalesServiceTest {

    private QuotationRepository quotations;
    private SalesOrderRepository orders;
    private InvoiceRepository invoices;
    private PaymentRepository payments;
    private SalesNumberService numberService;
    private SalesService service;

    @BeforeEach
    void setUp() {
        quotations = mock(QuotationRepository.class);
        orders = mock(SalesOrderRepository.class);
        invoices = mock(InvoiceRepository.class);
        payments = mock(PaymentRepository.class);
        numberService = mock(SalesNumberService.class);
        ApplicationEventPublisher events = mock(ApplicationEventPublisher.class);
        when(quotations.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(orders.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(invoices.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(numberService.next(anyLong(), eq(SalesDocumentType.QUOTATION)))
                .thenReturn("QT-2026-0001");
        service = new SalesService(
                quotations,
                orders,
                invoices,
                payments,
                new SalesMapper(),
                numberService,
                events
        );
    }

    @Test
    void createQuotationCalculatesTotalsOnServer() {
        CreateQuotationRequest request = new CreateQuotationRequest(
                9L, "Cubeage", LocalDate.now().plusDays(10), null,
                List.of(new CreateQuotationRequest.Item(
                        3L, "ERP subscription", new BigDecimal("2"),
                        new BigDecimal("100.00"), new BigDecimal("18"))));

        QuotationResponse response = service.createQuotation(4L, request);

        assertEquals(new BigDecimal("200.00"), response.subtotal());
        assertEquals(new BigDecimal("36.00"), response.taxAmount());
        assertEquals(new BigDecimal("236.00"), response.totalAmount());
        assertEquals(1, response.itemCount());
        assertEquals(new BigDecimal("236.00"), response.items().get(0).lineTotal());
        assertEquals("QT-2026-0001", response.quotationNumber());
    }

    @Test
    void paymentCannotExceedTenantInvoiceBalance() {
        Invoice invoice = Invoice.builder().id(7L).tenantId(4L).status(InvoiceStatus.SENT)
                .issueDate(LocalDate.now()).dueDate(LocalDate.now().plusDays(10))
                .totalAmount(new BigDecimal("50.00")).paidAmount(BigDecimal.ZERO)
                .balanceDue(new BigDecimal("50.00")).build();
        when(invoices.findByIdAndTenantId(7L, 4L)).thenReturn(Optional.of(invoice));

        PaymentRequest request = new PaymentRequest(new BigDecimal("50.01"),
                PaymentMethod.UPI, "UPI-1", null, null);

        assertThrows(IllegalArgumentException.class,
                () -> service.recordPayment(4L, 7L, request));
        verify(payments, never()).save(any());
    }

    @Test
    void completingOrderRecordsActualDeliveryDate() {
        LocalDate orderDate = LocalDate.now().minusDays(5);
        LocalDate deliveredOn = LocalDate.now();
        SalesOrder order = SalesOrder.builder()
                .id(8L)
                .tenantId(4L)
                .orderNumber("SO-2026-0412")
                .customerId(9L)
                .customerName("Hero MotoCorp")
                .status(SalesOrderStatus.IN_PROGRESS)
                .orderDate(orderDate)
                .expectedDeliveryDate(deliveredOn.plusDays(1))
                .subtotal(new BigDecimal("100.00"))
                .taxAmount(new BigDecimal("18.00"))
                .totalAmount(new BigDecimal("118.00"))
                .build();
        when(orders.findByIdAndTenantId(8L, 4L)).thenReturn(Optional.of(order));

        var response = service.updateOrderStatus(
                4L,
                8L,
                new UpdateSalesOrderStatusRequest(SalesOrderStatus.COMPLETED, deliveredOn)
        );

        assertEquals(SalesOrderStatus.COMPLETED, response.status());
        assertEquals(deliveredOn, response.actualDeliveryDate());
    }

    @Test
    void analyticsReturnsSixMonthsAndRanksCustomersByRevenue() {
        YearMonth now = YearMonth.now();
        Invoice hero = invoice(1L, "Hero MotoCorp", now.atDay(7), "1410000.00");
        Invoice tata = invoice(2L, "Tata Steel", now.minusMonths(1).atDay(22), "3140000.00");
        Invoice heroEarlier = invoice(1L, "Hero MotoCorp", now.minusMonths(1).atDay(5), "100000.00");
        when(invoices.findByTenantIdAndIssueDateBetweenAndStatusNotOrderByIssueDateAsc(
                eq(4L), any(LocalDate.class), any(LocalDate.class), eq(InvoiceStatus.CANCELLED)))
                .thenReturn(List.of(heroEarlier, tata, hero));

        SalesAnalyticsResponse response = service.analytics(4L);

        assertEquals(6, response.monthlyRevenue().size());
        assertEquals("Tata Steel", response.topCustomers().get(0).customerName());
        assertEquals(new BigDecimal("3140000.00"), response.topCustomers().get(0).amount());
        assertEquals("Hero MotoCorp", response.topCustomers().get(1).customerName());
        assertEquals(new BigDecimal("1510000.00"), response.topCustomers().get(1).amount());
    }

    private Invoice invoice(Long customerId, String customerName, LocalDate issueDate, String total) {
        BigDecimal amount = new BigDecimal(total);
        return Invoice.builder()
                .tenantId(4L)
                .invoiceNumber("INV-2026-" + customerId)
                .salesOrderId(customerId)
                .customerId(customerId)
                .customerName(customerName)
                .status(InvoiceStatus.SENT)
                .issueDate(issueDate)
                .dueDate(issueDate.plusDays(14))
                .subtotal(amount)
                .taxAmount(BigDecimal.ZERO)
                .totalAmount(amount)
                .paidAmount(BigDecimal.ZERO)
                .balanceDue(amount)
                .build();
    }
}
