package com.cubeage.erp.purchase.service;

import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.purchase.dto.purchaseorder.*;
import com.cubeage.erp.purchase.entity.PurchaseOrder;
import com.cubeage.erp.purchase.entity.PurchaseOrderItem;
import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;
import com.cubeage.erp.purchase.mapper.PurchaseOrderMapper;
import com.cubeage.erp.purchase.repository.PurchaseOrderRepository;
import com.cubeage.erp.purchase.entity.Vendor;
import com.cubeage.erp.purchase.enums.VendorStatus;
import com.cubeage.erp.purchase.repository.GoodsReceiptRepository;
import com.cubeage.erp.purchase.repository.PayableRepository;
import com.cubeage.erp.purchase.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderService {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;
    private final GoodsReceiptRepository goodsReceiptRepository;
    private final PayableRepository payableRepository;
    private final PurchaseOrderMapper mapper;

    public PurchaseOrderResponse createPurchaseOrder(Long tenantId, CreatePurchaseOrderRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Vendor vendor = requireActiveVendor(effectiveTenantId, request.vendorId());
        String orderNumber = generateOrderNumber(effectiveTenantId);

        PurchaseOrder order = PurchaseOrder.builder()
                .tenantId(effectiveTenantId)
                .orderNumber(orderNumber)
                .vendorId(request.vendorId())
                .vendorName(vendor.getVendorName())
                .status(PurchaseOrderStatus.DRAFT)
                .orderDate(LocalDate.now())
                .expectedDeliveryDate(request.expectedDeliveryDate())
                .deliveryLocation(request.deliveryLocation())
                .paymentTerms(request.paymentTerms())
                .notes(request.notes())
                .subtotal(BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .build();

        applyItems(order, request.items());
        return mapper.toResponse(purchaseOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> listPurchaseOrders(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return purchaseOrderRepository.findListViewByTenantId(effectiveTenantId)
                .stream()
                .map(this::toListResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrder(Long tenantId, Long id) {
        return mapper.toResponse(requireOrder(tenantId, id));
    }

    public PurchaseOrderResponse updatePurchaseOrder(Long tenantId, Long id, UpdatePurchaseOrderRequest request) {
        PurchaseOrder order = requireOrder(tenantId, id);

        if (order.getStatus() == PurchaseOrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cancelled purchase order cannot be edited");
        }
        if (request.items() != null && !request.items().isEmpty()
                && order.getStatus() != PurchaseOrderStatus.DRAFT) {
            throw new IllegalArgumentException("Items can only be changed while a purchase order is in DRAFT status");
        }
        if (request.status() != null) {
            if (order.getStatus() == PurchaseOrderStatus.CONFIRMED
                    && request.status() != PurchaseOrderStatus.CONFIRMED) {
                throw new IllegalArgumentException("Confirmed purchase order status cannot be changed");
            }
            order.setStatus(request.status());
        }
        if (request.expectedDeliveryDate() != null) order.setExpectedDeliveryDate(request.expectedDeliveryDate());
        if (request.actualDeliveryDate() != null) {
            if (request.actualDeliveryDate().isBefore(order.getOrderDate())) {
                throw new IllegalArgumentException("Actual delivery date cannot be before order date");
            }
            order.setActualDeliveryDate(request.actualDeliveryDate());
        }
        if (request.deliveryLocation() != null) order.setDeliveryLocation(request.deliveryLocation());
        if (request.paymentTerms() != null) order.setPaymentTerms(request.paymentTerms());
        if (request.notes() != null) order.setNotes(request.notes());
        if (request.items() != null && !request.items().isEmpty()) {
            applyItems(order, request.items());
        }
        return mapper.toResponse(purchaseOrderRepository.save(order));
    }

    public void deletePurchaseOrder(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        PurchaseOrder order = requireOrder(tenantId, id);
        try {
            goodsReceiptRepository.deleteAll(
                    goodsReceiptRepository.findByTenantIdAndPurchaseOrderId(effectiveTenantId, id));
            payableRepository.deleteAll(
                    payableRepository.findByTenantIdAndPurchaseOrderId(effectiveTenantId, id));
            purchaseOrderRepository.delete(order);
            purchaseOrderRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalArgumentException("Purchase order cannot be deleted because it is still referenced by another record");
        }
    }

    private void applyItems(PurchaseOrder order, List<PurchaseOrderItemRequest> requestedItems) {
        List<PurchaseOrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        for (PurchaseOrderItemRequest req : requestedItems) {
            BigDecimal net = money(req.quantity().multiply(req.unitPrice()));
            BigDecimal lineTax = money(net.multiply(req.taxRate()).divide(HUNDRED, 4, RoundingMode.HALF_UP));
            subtotal = subtotal.add(net);
            totalTax = totalTax.add(lineTax);
            items.add(PurchaseOrderItem.builder()
                    .productId(req.productId())
                    .description(req.description().trim())
                    .quantity(req.quantity())
                    .unitPrice(money(req.unitPrice()))
                    .taxRate(req.taxRate())
                    .lineTotal(money(net.add(lineTax)))
                    .build());
        }
        order.replaceItems(items);
        order.setSubtotal(money(subtotal));
        order.setTaxAmount(money(totalTax));
        order.setTotalAmount(money(subtotal.add(totalTax)));
    }

    private String generateOrderNumber(Long tenantId) {
        int year = Year.now().getValue();
        return "PO-%d-%s".formatted(year,
                java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase());
    }

    private Vendor requireActiveVendor(Long tenantId, Long vendorId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Vendor vendor = vendorRepository.findByIdAndTenantId(vendorId, effectiveTenantId)
                .or(() -> vendorRepository.findById(vendorId))
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + vendorId));
        if (vendor.getStatus() != VendorStatus.ACTIVE) {
            throw new IllegalArgumentException("Purchase orders can only be created for active vendors");
        }
        return vendor;
    }

    private PurchaseOrderResponse toListResponse(PurchaseOrderRepository.PurchaseOrderListView order) {
        return new PurchaseOrderResponse(
                order.getId(), order.getTenantId(), order.getOrderNumber(), order.getVendorId(),
                order.getVendorName(), PurchaseOrderStatus.valueOf(order.getStatus()), order.getOrderDate(),
                order.getExpectedDeliveryDate(), null, null, null, null, BigDecimal.ZERO,
                BigDecimal.ZERO, order.getTotalAmount(), order.getItemCount(), List.of(), null, null);
    }

    private PurchaseOrder requireOrder(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return purchaseOrderRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> purchaseOrderRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + id));
    }

    private BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
