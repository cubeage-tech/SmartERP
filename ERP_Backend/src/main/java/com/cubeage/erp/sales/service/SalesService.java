package com.cubeage.erp.sales.service;

import com.cubeage.erp.sales.dto.request.*;
import com.cubeage.erp.sales.dto.response.*;
import com.cubeage.erp.sales.entity.*;
import com.cubeage.erp.sales.enums.*;
import com.cubeage.erp.sales.event.*;
import com.cubeage.erp.sales.mapper.SalesMapper;
import com.cubeage.erp.sales.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final QuotationRepository quotations;
    private final SalesOrderRepository orders;
    private final InvoiceRepository invoices;
    private final PaymentRepository payments;
    private final SalesMapper mapper;
    private final SalesNumberService numberService;
    private final ApplicationEventPublisher events;

    public QuotationResponse createQuotation(Long tenantId, CreateQuotationRequest request) {
        Quotation quotation = Quotation.builder()
                .tenantId(tenantId)
                .quotationNumber(numberService.next(tenantId, SalesDocumentType.QUOTATION))
                .customerId(request.customerId())
                .customerName(request.customerName().trim())
                .status(QuotationStatus.DRAFT)
                .quotationDate(LocalDate.now())
                .validUntil(request.validUntil())
                .notes(request.notes())
                .build();
        applyItems(quotation, request.items());
        return mapper.quotation(quotations.save(quotation));
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> quotations(Long tenantId) {
        return quotations.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(mapper::quotation)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuotationResponse quotation(Long tenantId, Long id) {
        return mapper.quotation(requireQuotation(tenantId, id));
    }

    public QuotationResponse updateQuotation(Long tenantId, Long id, UpdateQuotationRequest request) {
        Quotation quotation = requireQuotation(tenantId, id);
        if (quotation.getStatus() == QuotationStatus.CONVERTED) {
            throw new IllegalStateException("Converted quotation cannot be edited");
        }
        if (request.customerName() != null) quotation.setCustomerName(request.customerName().trim());
        if (request.validUntil() != null) {
            if (request.validUntil().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Validity date cannot be in the past");
            }
            quotation.setValidUntil(request.validUntil());
        }
        if (request.notes() != null) quotation.setNotes(request.notes());
        if (request.status() != null) {
            validateQuotationTransition(quotation.getStatus(), request.status());
            quotation.setStatus(request.status());
        }
        if (request.items() != null && !request.items().isEmpty()) {
            applyItems(quotation, request.items());
        }
        return mapper.quotation(quotations.save(quotation));
    }

    public SalesOrderResponse convertToOrder(Long tenantId, Long quotationId, LocalDate expectedDelivery) {
        Quotation quotation = requireQuotation(tenantId, quotationId);
        if (quotation.getStatus() != QuotationStatus.ACCEPTED) {
            throw new IllegalStateException("Only accepted quotations can be converted");
        }
        if (orders.existsByTenantIdAndQuotationId(tenantId, quotationId)) {
            throw new IllegalStateException("Quotation is already converted");
        }

        SalesOrder order = SalesOrder.builder()
                .tenantId(tenantId)
                .orderNumber(numberService.next(tenantId, SalesDocumentType.ORDER))
                .quotationId(quotation.getId())
                .customerId(quotation.getCustomerId())
                .customerName(quotation.getCustomerName())
                .status(SalesOrderStatus.CONFIRMED)
                .orderDate(LocalDate.now())
                .expectedDeliveryDate(expectedDelivery)
                .subtotal(quotation.getSubtotal())
                .taxAmount(quotation.getTaxAmount())
                .totalAmount(quotation.getTotalAmount())
                .build();
        quotation.getItems().forEach(item -> order.addItem(SalesOrderItem.builder()
                .productId(item.getProductId())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .taxRate(item.getTaxRate())
                .lineTotal(item.getLineTotal())
                .build()));

        SalesOrder savedOrder = orders.save(order);
        quotation.setStatus(QuotationStatus.CONVERTED);
        quotations.save(quotation);
        events.publishEvent(new OrderCreatedEvent(
                tenantId, savedOrder.getId(), savedOrder.getOrderNumber(), Instant.now()));
        return mapper.order(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<SalesOrderResponse> orders(Long tenantId) {
        return orders.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(mapper::order)
                .toList();
    }

    @Transactional(readOnly = true)
    public SalesOrderResponse order(Long tenantId, Long id) {
        return mapper.order(requireOrder(tenantId, id));
    }

    public SalesOrderResponse updateOrderStatus(
            Long tenantId,
            Long id,
            UpdateSalesOrderStatusRequest request
    ) {
        SalesOrder order = requireOrder(tenantId, id);
        if (request.status() == SalesOrderStatus.INVOICED) {
            throw new IllegalArgumentException("INVOICED is managed by invoice creation");
        }
        validateOrderTransition(order.getStatus(), request.status());
        order.setStatus(request.status());
        if (request.status() == SalesOrderStatus.COMPLETED) {
            LocalDate delivered = request.actualDeliveryDate() == null
                    ? LocalDate.now()
                    : request.actualDeliveryDate();
            if (delivered.isBefore(order.getOrderDate())) {
                throw new IllegalArgumentException("Delivery date cannot precede order date");
            }
            order.setActualDeliveryDate(delivered);
        }
        return mapper.order(orders.save(order));
    }

    public InvoiceResponse createInvoice(Long tenantId, Long orderId, LocalDate dueDate) {
        SalesOrder order = requireOrder(tenantId, orderId);
        if (order.getStatus() == SalesOrderStatus.CANCELLED) {
            throw new IllegalStateException("Cancelled order cannot be invoiced");
        }
        if (invoices.existsByTenantIdAndSalesOrderId(tenantId, orderId)) {
            throw new IllegalStateException("Order is already invoiced");
        }

        LocalDate issueDate = LocalDate.now();
        LocalDate resolvedDueDate = dueDate == null ? issueDate.plusDays(30) : dueDate;
        if (resolvedDueDate.isBefore(issueDate)) {
            throw new IllegalArgumentException("Due date cannot be before issue date");
        }

        Invoice invoice = Invoice.builder()
                .tenantId(tenantId)
                .invoiceNumber(numberService.next(tenantId, SalesDocumentType.INVOICE))
                .salesOrderId(order.getId())
                .customerId(order.getCustomerId())
                .customerName(order.getCustomerName())
                .status(InvoiceStatus.SENT)
                .issueDate(issueDate)
                .dueDate(resolvedDueDate)
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .paidAmount(money(BigDecimal.ZERO))
                .balanceDue(order.getTotalAmount())
                .build();
        order.getItems().forEach(item -> invoice.addItem(InvoiceItem.builder()
                .productId(item.getProductId())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .taxRate(item.getTaxRate())
                .lineTotal(item.getLineTotal())
                .build()));

        Invoice savedInvoice = invoices.save(invoice);
        order.setStatus(SalesOrderStatus.INVOICED);
        orders.save(order);
        events.publishEvent(new InvoiceCreatedEvent(
                tenantId, savedInvoice.getId(), savedInvoice.getInvoiceNumber(), Instant.now()));
        return mapper.invoice(savedInvoice);
    }

    public List<InvoiceResponse> invoices(Long tenantId) {
        return invoices.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                .map(this::markOverdue)
                .map(mapper::invoice)
                .toList();
    }

    public InvoiceResponse invoice(Long tenantId, Long id) {
        return mapper.invoice(markOverdue(requireInvoice(tenantId, id)));
    }

    public InvoiceResponse recordPayment(Long tenantId, Long invoiceId, PaymentRequest request) {
        Invoice invoice = markOverdue(requireInvoice(tenantId, invoiceId));
        if (invoice.getStatus() == InvoiceStatus.CANCELLED
                || invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Invoice does not accept payments");
        }
        BigDecimal amount = money(request.amount());
        if (amount.compareTo(invoice.getBalanceDue()) > 0) {
            throw new IllegalArgumentException("Payment exceeds outstanding balance");
        }
        if (payments.existsByTenantIdAndReference(tenantId, request.reference())) {
            throw new IllegalArgumentException("Payment reference already exists");
        }

        Payment payment = payments.save(Payment.builder()
                .tenantId(tenantId)
                .invoiceId(invoiceId)
                .amount(amount)
                .method(request.method())
                .reference(request.reference().trim())
                .paidAt(request.paidAt() == null ? Instant.now() : request.paidAt())
                .notes(request.notes())
                .build());
        invoice.setPaidAmount(money(invoice.getPaidAmount().add(amount)));
        invoice.setBalanceDue(money(invoice.getTotalAmount().subtract(invoice.getPaidAmount())));
        invoice.setStatus(invoice.getBalanceDue().signum() == 0
                ? InvoiceStatus.PAID
                : InvoiceStatus.PARTIALLY_PAID);
        invoice = invoices.save(invoice);
        events.publishEvent(new PaymentReceivedEvent(
                tenantId, invoiceId, payment.getId(), amount, Instant.now()));
        return mapper.invoice(invoice);
    }

    @Transactional(readOnly = true)
    public SalesDashboardResponse dashboard(Long tenantId) {
        LocalDate today = LocalDate.now();
        LocalDate currentMonthStart = today.withDayOfMonth(1);
        LocalDate previousMonthStart = currentMonthStart.minusMonths(1);
        LocalDate previousMonthEnd = currentMonthStart.minusDays(1);
        LocalDate yearStart = today.withDayOfYear(1);

        List<Invoice> allInvoices = invoices.findByTenantIdOrderByCreatedAtDesc(tenantId);
        List<SalesOrder> allOrders = orders.findByTenantIdOrderByCreatedAtDesc(tenantId);
        BigDecimal revenueMtd = sumInvoices(allInvoices, currentMonthStart, today);
        BigDecimal previousRevenue = sumInvoices(allInvoices, previousMonthStart, previousMonthEnd);
        BigDecimal outstanding = money(allInvoices.stream()
                .filter(invoice -> invoice.getStatus() != InvoiceStatus.CANCELLED)
                .map(Invoice::getBalanceDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        long pendingInvoices = allInvoices.stream()
                .filter(invoice -> invoice.getStatus() != InvoiceStatus.CANCELLED)
                .filter(invoice -> invoice.getBalanceDue().signum() > 0)
                .count();

        List<SalesOrder> ytdOrders = ordersWithin(allOrders, yearStart, today);
        BigDecimal ordersYtdAmount = money(ytdOrders.stream()
                .filter(order -> order.getStatus() != SalesOrderStatus.CANCELLED)
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        long orderCountYtd = ytdOrders.stream()
                .filter(order -> order.getStatus() != SalesOrderStatus.CANCELLED)
                .count();
        BigDecimal onTimeCurrent = onTimePercentage(
                deliveriesWithin(allOrders, currentMonthStart, today));
        BigDecimal onTimePrevious = onTimePercentage(
                deliveriesWithin(allOrders, previousMonthStart, previousMonthEnd));

        return new SalesDashboardResponse(
                revenueMtd,
                percentageChange(revenueMtd, previousRevenue),
                outstanding,
                pendingInvoices,
                ordersYtdAmount,
                orderCountYtd,
                onTimeCurrent,
                money(onTimeCurrent.subtract(onTimePrevious)),
                "INR"
        );
    }

    @Transactional(readOnly = true)
    public SalesAnalyticsResponse analytics(Long tenantId) {
        YearMonth currentMonth = YearMonth.now();
        YearMonth firstMonth = currentMonth.minusMonths(5);
        List<Invoice> periodInvoices = invoices
                .findByTenantIdAndIssueDateBetweenAndStatusNotOrderByIssueDateAsc(
                        tenantId,
                        firstMonth.atDay(1),
                        currentMonth.atEndOfMonth(),
                        InvoiceStatus.CANCELLED
                );

        Map<YearMonth, BigDecimal> revenueByMonth = periodInvoices.stream()
                .collect(Collectors.groupingBy(
                        invoice -> YearMonth.from(invoice.getIssueDate()),
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Invoice::getTotalAmount, BigDecimal::add)
                ));
        List<SalesAnalyticsResponse.MonthlyRevenue> monthlyRevenue =
                firstMonth.atDay(1)
                        .datesUntil(currentMonth.plusMonths(1).atDay(1), Period.ofMonths(1))
                        .map(YearMonth::from)
                        .map(month -> new SalesAnalyticsResponse.MonthlyRevenue(
                                month, money(revenueByMonth.getOrDefault(month, BigDecimal.ZERO))))
                        .toList();

        Map<Long, CustomerRevenue> customers = periodInvoices.stream()
                .collect(Collectors.toMap(
                        Invoice::getCustomerId,
                        invoice -> new CustomerRevenue(
                                invoice.getCustomerId(),
                                invoice.getCustomerName(),
                                invoice.getTotalAmount()),
                        CustomerRevenue::merge
                ));
        List<CustomerRevenue> rankedCustomers = customers.values().stream()
                .sorted(Comparator.comparing(CustomerRevenue::amount).reversed())
                .limit(5)
                .toList();
        List<SalesAnalyticsResponse.TopCustomer> topCustomers = IntStream
                .range(0, rankedCustomers.size())
                .mapToObj(index -> {
                    CustomerRevenue customer = rankedCustomers.get(index);
                    return new SalesAnalyticsResponse.TopCustomer(
                            index + 1,
                            customer.customerId(),
                            customer.customerName(),
                            money(customer.amount())
                    );
                })
                .toList();
        return new SalesAnalyticsResponse(monthlyRevenue, topCustomers, "INR");
    }

    private void applyItems(Quotation quotation, List<CreateQuotationRequest.Item> requestedItems) {
        List<QuotationItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal tax = BigDecimal.ZERO;
        for (CreateQuotationRequest.Item requested : requestedItems) {
            BigDecimal net = money(requested.quantity().multiply(requested.unitPrice()));
            BigDecimal lineTax = money(net.multiply(requested.taxRate())
                    .divide(HUNDRED, 4, RoundingMode.HALF_UP));
            subtotal = subtotal.add(net);
            tax = tax.add(lineTax);
            items.add(QuotationItem.builder()
                    .productId(requested.productId())
                    .description(requested.description().trim())
                    .quantity(requested.quantity())
                    .unitPrice(money(requested.unitPrice()))
                    .taxRate(requested.taxRate())
                    .lineTotal(money(net.add(lineTax)))
                    .build());
        }
        quotation.replaceItems(items);
        quotation.setSubtotal(money(subtotal));
        quotation.setTaxAmount(money(tax));
        quotation.setTotalAmount(money(subtotal.add(tax)));
    }

    private void validateQuotationTransition(QuotationStatus current, QuotationStatus requested) {
        if (current == requested) return;
        boolean valid = switch (current) {
            case DRAFT -> requested == QuotationStatus.SENT;
            case SENT -> requested == QuotationStatus.ACCEPTED
                    || requested == QuotationStatus.REJECTED
                    || requested == QuotationStatus.EXPIRED;
            case ACCEPTED -> requested == QuotationStatus.REJECTED;
            case REJECTED, EXPIRED, CONVERTED -> false;
        };
        if (!valid) {
            throw new IllegalStateException(
                    "Invalid quotation status transition: " + current + " -> " + requested);
        }
    }

    private void validateOrderTransition(SalesOrderStatus current, SalesOrderStatus requested) {
        if (current == requested) return;
        boolean valid = switch (current) {
            case CONFIRMED -> requested == SalesOrderStatus.IN_PROGRESS
                    || requested == SalesOrderStatus.CANCELLED;
            case IN_PROGRESS -> requested == SalesOrderStatus.COMPLETED
                    || requested == SalesOrderStatus.CANCELLED;
            case COMPLETED -> requested == SalesOrderStatus.INVOICED;
            case CANCELLED, INVOICED -> false;
        };
        if (!valid) {
            throw new IllegalStateException(
                    "Invalid order status transition: " + current + " -> " + requested);
        }
    }

    private Invoice markOverdue(Invoice invoice) {
        if ((invoice.getStatus() == InvoiceStatus.SENT
                || invoice.getStatus() == InvoiceStatus.PARTIALLY_PAID)
                && invoice.getDueDate().isBefore(LocalDate.now())
                && invoice.getBalanceDue().signum() > 0) {
            invoice.setStatus(InvoiceStatus.OVERDUE);
            return invoices.save(invoice);
        }
        return invoice;
    }

    private BigDecimal sumInvoices(List<Invoice> source, LocalDate from, LocalDate to) {
        return money(source.stream()
                .filter(invoice -> invoice.getStatus() != InvoiceStatus.CANCELLED)
                .filter(invoice -> !invoice.getIssueDate().isBefore(from))
                .filter(invoice -> !invoice.getIssueDate().isAfter(to))
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private List<SalesOrder> ordersWithin(List<SalesOrder> source, LocalDate from, LocalDate to) {
        return source.stream()
                .filter(order -> !order.getOrderDate().isBefore(from))
                .filter(order -> !order.getOrderDate().isAfter(to))
                .toList();
    }

    private List<SalesOrder> deliveriesWithin(
            List<SalesOrder> source,
            LocalDate from,
            LocalDate to
    ) {
        return source.stream()
                .filter(order -> order.getActualDeliveryDate() != null)
                .filter(order -> !order.getActualDeliveryDate().isBefore(from))
                .filter(order -> !order.getActualDeliveryDate().isAfter(to))
                .toList();
    }

    private BigDecimal onTimePercentage(List<SalesOrder> source) {
        List<SalesOrder> delivered = source.stream()
                .filter(order -> order.getActualDeliveryDate() != null)
                .toList();
        if (delivered.isEmpty()) return money(BigDecimal.ZERO);
        long onTime = delivered.stream()
                .filter(order -> order.getExpectedDeliveryDate() != null)
                .filter(order -> !order.getActualDeliveryDate()
                        .isAfter(order.getExpectedDeliveryDate()))
                .count();
        return BigDecimal.valueOf(onTime)
                .multiply(HUNDRED)
                .divide(BigDecimal.valueOf(delivered.size()), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal percentageChange(BigDecimal current, BigDecimal previous) {
        if (previous.signum() == 0) {
            return current.signum() == 0 ? money(BigDecimal.ZERO) : money(HUNDRED);
        }
        return current.subtract(previous)
                .multiply(HUNDRED)
                .divide(previous, 2, RoundingMode.HALF_UP);
    }

    private Quotation requireQuotation(Long tenantId, Long id) {
        return quotations.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Quotation not found"));
    }

    private SalesOrder requireOrder(Long tenantId, Long id) {
        return orders.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Sales order not found"));
    }

    private Invoice requireInvoice(Long tenantId, Long id) {
        return invoices.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
    }

    private BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private record CustomerRevenue(Long customerId, String customerName, BigDecimal amount) {
        private CustomerRevenue merge(CustomerRevenue other) {
            return new CustomerRevenue(customerId, customerName, amount.add(other.amount));
        }
    }
}
