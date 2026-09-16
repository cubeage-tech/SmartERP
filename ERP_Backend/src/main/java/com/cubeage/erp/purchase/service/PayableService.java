package com.cubeage.erp.purchase.service;

import com.cubeage.erp.common.exception.BadRequestException;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.purchase.dto.payable.PayableResponse;
import com.cubeage.erp.purchase.dto.payable.PayableSummaryResponse;
import com.cubeage.erp.purchase.dto.payable.RecordPaymentRequest;
import com.cubeage.erp.purchase.dto.payable.PayableResponse.CreatePayableRequest;
import com.cubeage.erp.purchase.entity.Payable;
import com.cubeage.erp.purchase.entity.PurchaseOrder;
import com.cubeage.erp.purchase.enums.PaymentStatus;
import com.cubeage.erp.purchase.mapper.PayableMapper;
import com.cubeage.erp.purchase.repository.PayableRepository;
import com.cubeage.erp.purchase.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PayableService {

    private final PayableRepository payableRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PayableMapper mapper;

    public List<PayableResponse> listPayables(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return payableRepository.findByTenantIdOrderByDueDateAsc(effectiveTenantId)
                .stream()
                .map(p -> mapper.toResponse(markOverdue(p)))
                .toList();
    }

    public PayableResponse getPayable(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return mapper.toResponse(markOverdue(requirePayable(effectiveTenantId, id)));
    }

    public PayableSummaryResponse getSummary(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        payableRepository.findByTenantIdOrderByDueDateAsc(effectiveTenantId).forEach(this::markOverdue);
        BigDecimal totalOutstanding = payableRepository.totalOutstandingPayables(effectiveTenantId);
        BigDecimal totalOverdue = payableRepository.totalOverduePayables(effectiveTenantId);

        LocalDate today = LocalDate.now();
        LocalDate weekEnd = today.plusDays(7);
        BigDecimal dueThisWeek = payableRepository
                .findByTenantIdAndStatusIn(effectiveTenantId, List.of(PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID))
                .stream()
                .filter(p -> !p.getDueDate().isBefore(today) && !p.getDueDate().isAfter(weekEnd))
                .map(Payable::getBalanceDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingCount = payableRepository
                .findByTenantIdAndStatusIn(effectiveTenantId, List.of(PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID, PaymentStatus.OVERDUE))
                .size();

        return new PayableSummaryResponse(
                money(totalOutstanding),
                money(totalOverdue),
                money(dueThisWeek),
                pendingCount,
                "INR"
        );
    }

    public PayableResponse recordPayment(Long tenantId, Long id, RecordPaymentRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Payable payable = markOverdue(requirePayable(effectiveTenantId, id));

        if (payable.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Payable is already fully paid");
        }
        BigDecimal amount = money(request.amount());
        if (amount.compareTo(payable.getBalanceDue()) > 0) {
            throw new BadRequestException("Payment amount exceeds outstanding balance");
        }
        if (payableRepository.existsByTenantIdAndPaymentReference(effectiveTenantId, request.paymentReference())) {
            throw new BadRequestException("Payment reference already exists: " + request.paymentReference());
        }

        payable.setPaidAmount(money(payable.getPaidAmount().add(amount)));
        payable.setBalanceDue(money(payable.getTotalAmount().subtract(payable.getPaidAmount())));
        payable.setPaymentReference(request.paymentReference());
        payable.setPaidAt(request.paidAt() != null ? request.paidAt() : Instant.now());
        payable.setNotes(request.notes());
        payable.setStatus(payable.getBalanceDue().signum() == 0
                ? PaymentStatus.PAID
                : PaymentStatus.PARTIALLY_PAID);

        return mapper.toResponse(payableRepository.save(payable));
    }

    public PayableResponse createPayable(Long tenantId, CreatePayableRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        PurchaseOrder order = purchaseOrderRepository.findByIdAndTenantId(request.purchaseOrderId(), effectiveTenantId)
                .or(() -> purchaseOrderRepository.findById(request.purchaseOrderId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + request.purchaseOrderId()));
        if (request.dueDate().isBefore(request.invoiceDate())) {
            throw new BadRequestException("Due date cannot be before invoice date");
        }
        if (payableRepository.existsByTenantIdAndInvoiceReference(effectiveTenantId, request.invoiceReference().trim())) {
            throw new BadRequestException("Invoice reference already exists: " + request.invoiceReference());
        }
        BigDecimal amount = money(request.totalAmount());
        Payable payable = Payable.builder()
                .tenantId(effectiveTenantId)
                .purchaseOrderId(order.getId())
                .vendorId(order.getVendorId())
                .vendorName(order.getVendorName())
                .invoiceReference(request.invoiceReference().trim())
                .invoiceDate(request.invoiceDate())
                .dueDate(request.dueDate())
                .totalAmount(amount)
                .paidAmount(BigDecimal.ZERO.setScale(2))
                .balanceDue(amount)
                .status(PaymentStatus.UNPAID)
                .notes(request.notes())
                .build();
        return mapper.toResponse(payableRepository.save(payable));
    }

    private Payable markOverdue(Payable payable) {
        if ((payable.getStatus() == PaymentStatus.UNPAID
                || payable.getStatus() == PaymentStatus.PARTIALLY_PAID)
                && payable.getDueDate().isBefore(LocalDate.now())
                && payable.getBalanceDue().signum() > 0) {
            payable.setStatus(PaymentStatus.OVERDUE);
            return payableRepository.save(payable);
        }
        return payable;
    }

    private Payable requirePayable(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return payableRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> payableRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Payable not found: " + id));
    }

    private BigDecimal money(BigDecimal value) {
        return value == null ? BigDecimal.ZERO.setScale(2) : value.setScale(2, RoundingMode.HALF_UP);
    }
}
