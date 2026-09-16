package com.cubeage.erp.purchase.service;

import com.cubeage.erp.purchase.dto.dashboard.PurchaseDashboardResponse;
import com.cubeage.erp.purchase.entity.GoodsReceipt;
import com.cubeage.erp.purchase.enums.PaymentStatus;
import com.cubeage.erp.purchase.enums.VendorStatus;
import com.cubeage.erp.purchase.repository.GoodsReceiptRepository;
import com.cubeage.erp.purchase.repository.PayableRepository;
import com.cubeage.erp.purchase.repository.PurchaseOrderRepository;
import com.cubeage.erp.purchase.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseDashboardService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;
    private final PayableRepository payableRepository;
    private final GoodsReceiptRepository grnRepository;

    public PurchaseDashboardResponse getDashboard(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        LocalDate today = LocalDate.now();
        LocalDate currentMonthStart = today.withDayOfMonth(1);
        LocalDate previousMonthStart = currentMonthStart.minusMonths(1);
        LocalDate previousMonthEnd = currentMonthStart.minusDays(1);

        // Purchase MTD
        BigDecimal purchaseMtd = purchaseOrderRepository.sumPurchaseAmountBetween(
                effectiveTenantId, currentMonthStart, today);
        BigDecimal purchasePrev = purchaseOrderRepository.sumPurchaseAmountBetween(
                effectiveTenantId, previousMonthStart, previousMonthEnd);
        BigDecimal purchaseChange = percentageChange(purchaseMtd, purchasePrev);

        // Payables
        BigDecimal totalPayables = payableRepository.totalOutstandingPayables(effectiveTenantId);
        long pendingPayableCount = payableRepository
                .findByTenantIdAndStatusIn(effectiveTenantId,
                        List.of(PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID, PaymentStatus.OVERDUE))
                .size();

        // Active Vendors
        long activeVendorCount = vendorRepository.countByTenantIdAndStatus(effectiveTenantId, VendorStatus.ACTIVE);

        // On-Time Receipt
        List<GoodsReceipt> currentGrns = grnRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenantId)
                .stream()
                .filter(g -> !g.getReceivedDate().isBefore(currentMonthStart)
                        && !g.getReceivedDate().isAfter(today))
                .toList();
        List<GoodsReceipt> previousGrns = grnRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenantId)
                .stream()
                .filter(g -> !g.getReceivedDate().isBefore(previousMonthStart)
                        && !g.getReceivedDate().isAfter(previousMonthEnd))
                .toList();

        BigDecimal currentOnTime = onTimeReceiptPercentage(currentGrns, effectiveTenantId);
        BigDecimal previousOnTime = onTimeReceiptPercentage(previousGrns, effectiveTenantId);

        return new PurchaseDashboardResponse(
                money(purchaseMtd),
                money(purchaseChange),
                money(totalPayables),
                pendingPayableCount,
                activeVendorCount,
                money(currentOnTime),
                money(currentOnTime.subtract(previousOnTime)),
                "INR"
        );
    }

    private BigDecimal onTimeReceiptPercentage(List<GoodsReceipt> grns, Long tenantId) {
        if (grns.isEmpty()) return BigDecimal.ZERO;
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        // On-time: received on or before expected delivery date of the PO
        long onTime = grns.stream()
                .filter(grn -> {
                    return purchaseOrderRepository.findByIdAndTenantId(grn.getPurchaseOrderId(), effectiveTenantId)
                            .or(() -> purchaseOrderRepository.findById(grn.getPurchaseOrderId()))
                            .map(po -> po.getExpectedDeliveryDate() == null
                                     || !grn.getReceivedDate().isAfter(po.getExpectedDeliveryDate()))
                            .orElse(false);
                })
                .count();
        return BigDecimal.valueOf(onTime)
                .multiply(HUNDRED)
                .divide(BigDecimal.valueOf(grns.size()), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal percentageChange(BigDecimal current, BigDecimal previous) {
        if (current == null) current = BigDecimal.ZERO;
        if (previous == null || previous.signum() == 0) {
            return current.signum() == 0 ? BigDecimal.ZERO : HUNDRED;
        }
        return current.subtract(previous)
                .multiply(HUNDRED)
                .divide(previous, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal money(BigDecimal value) {
        return value == null ? BigDecimal.ZERO.setScale(2) : value.setScale(2, RoundingMode.HALF_UP);
    }
}