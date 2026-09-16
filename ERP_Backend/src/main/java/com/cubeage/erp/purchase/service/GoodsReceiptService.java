package com.cubeage.erp.purchase.service;

import com.cubeage.erp.common.exception.BadRequestException;
import com.cubeage.erp.common.exception.ResourceNotFoundException;
import com.cubeage.erp.purchase.dto.grn.CreateGoodsReceiptRequest;
import com.cubeage.erp.purchase.dto.grn.GoodsReceiptItemRequest;
import com.cubeage.erp.purchase.dto.grn.GoodsReceiptResponse;
import com.cubeage.erp.purchase.entity.GoodsReceipt;
import com.cubeage.erp.purchase.entity.GoodsReceiptItem;
import com.cubeage.erp.purchase.entity.PurchaseOrder;
import com.cubeage.erp.purchase.entity.PurchaseOrderItem;
import com.cubeage.erp.purchase.entity.Vendor;
import com.cubeage.erp.purchase.enums.GRNStatus;
import com.cubeage.erp.purchase.enums.PurchaseOrderStatus;
import com.cubeage.erp.purchase.enums.QualityStatus;
import com.cubeage.erp.purchase.mapper.GoodsReceiptMapper;
import com.cubeage.erp.purchase.repository.GoodsReceiptRepository;
import com.cubeage.erp.purchase.repository.PurchaseOrderRepository;
import com.cubeage.erp.purchase.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class GoodsReceiptService {

    private final GoodsReceiptRepository grnRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;
    private final GoodsReceiptMapper mapper;

    public GoodsReceiptResponse createGoodsReceipt(Long tenantId, CreateGoodsReceiptRequest request) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        PurchaseOrder order = purchaseOrderRepository.findByIdAndTenantId(request.purchaseOrderId(), effectiveTenantId)
                .or(() -> purchaseOrderRepository.findById(request.purchaseOrderId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Purchase order not found: " + request.purchaseOrderId()));
        if (order.getStatus() != PurchaseOrderStatus.CONFIRMED
                && order.getStatus() != PurchaseOrderStatus.IN_PROGRESS) {
            throw new BadRequestException("Goods can only be received against a confirmed or in-progress purchase order");
        }
        if (request.receivedDate().isBefore(order.getOrderDate())) {
            throw new BadRequestException("Receipt date cannot be before the purchase order date");
        }
        Vendor vendor = vendorRepository.findByIdAndTenantId(request.vendorId(), effectiveTenantId)
                .or(() -> vendorRepository.findById(request.vendorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found: " + request.vendorId()));
        if (!Objects.equals(order.getVendorId(), vendor.getId())) {
            throw new BadRequestException("Goods receipt vendor must match the purchase order vendor");
        }

        Map<Long, PurchaseOrderItem> orderItems = new HashMap<>();
        for (PurchaseOrderItem item : order.getItems()) orderItems.put(item.getId(), item);
        Map<Long, BigDecimal> alreadyReceived = receivedQuantities(tenantId, order.getId());
        Map<Long, BigDecimal> requestedQuantities = new HashMap<>();

        String grnNumber = generateGrnNumber(effectiveTenantId);

        GoodsReceipt grn = GoodsReceipt.builder()
                .tenantId(effectiveTenantId)
                .grnNumber(grnNumber)
                .purchaseOrderId(request.purchaseOrderId())
                .vendorId(request.vendorId())
                .vendorName(vendor.getVendorName())
                .receivedDate(request.receivedDate())
                .status(GRNStatus.RECEIVED)
                .qualityStatus(request.qualityStatus() != null ? request.qualityStatus() : QualityStatus.ACCEPTED)
                .notes(request.notes())
                .totalValue(BigDecimal.ZERO)
                .build();

        BigDecimal totalValue = BigDecimal.ZERO;
        for (GoodsReceiptItemRequest itemReq : request.items()) {
            if (itemReq.purchaseOrderItemId() == null) {
                throw new BadRequestException("Every goods receipt item must reference a purchase order item"   );
            }

            if (itemReq.receivedQuantity() == null) {
                throw new BadRequestException("Received quantity is required for every goods receipt item");
            }
            if (itemReq.receivedQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Received quantity must be greater than zero");
            }
            PurchaseOrderItem orderItem = orderItems.get(itemReq.purchaseOrderItemId());
            if (orderItem == null || !Objects.equals(orderItem.getProductId(), itemReq.productId())) {
                throw new BadRequestException("Goods receipt item does not belong to the purchase order");
            }
            BigDecimal cumulative = alreadyReceived.getOrDefault(orderItem.getId(), BigDecimal.ZERO)
                    .add(requestedQuantities.getOrDefault(orderItem.getId(), BigDecimal.ZERO))
                    .add(itemReq.receivedQuantity());
            if (cumulative.compareTo(orderItem.getQuantity()) > 0) {
                throw new BadRequestException("Received quantity exceeds remaining quantity for item: " + orderItem.getDescription());
            }
            requestedQuantities.merge(orderItem.getId(), itemReq.receivedQuantity(), BigDecimal::add);
            BigDecimal lineTotal = money(itemReq.receivedQuantity().multiply(orderItem.getUnitPrice()));
            totalValue = totalValue.add(lineTotal);
            grn.addItem(GoodsReceiptItem.builder()
                    .purchaseOrderItemId(orderItem.getId())
                    .productId(orderItem.getProductId())
                    .description(orderItem.getDescription())
                    .orderedQuantity(orderItem.getQuantity())
                    .receivedQuantity(itemReq.receivedQuantity())
                    .unitPrice(money(orderItem.getUnitPrice()))
                    .lineTotal(lineTotal)
                    .build());
        }
        grn.setTotalValue(money(totalValue));

        GoodsReceipt saved = grnRepository.save(grn);
        updatePurchaseOrderReceiptStatus(order, effectiveTenantId, request.receivedDate());
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<GoodsReceiptResponse> listGoodsReceipts(Long tenantId) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return grnRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenantId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public GoodsReceiptResponse getGoodsReceipt(Long tenantId, Long id) {
        return mapper.toResponse(requireGrn(tenantId, id));
    }

    public void deleteGoodsReceipt(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        GoodsReceipt grn = requireGrn(effectiveTenantId, id);
        PurchaseOrder order = purchaseOrderRepository.findByIdAndTenantId(grn.getPurchaseOrderId(), effectiveTenantId)
                .or(() -> purchaseOrderRepository.findById(grn.getPurchaseOrderId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + grn.getPurchaseOrderId()));
        grnRepository.delete(grn);
        grnRepository.flush();
        updatePurchaseOrderReceiptStatus(order, effectiveTenantId, null);
    }

    private String generateGrnNumber(Long tenantId) {
        int year = Year.now().getValue();
        return "GRN-%d-%s".formatted(year,
                java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase());
    }

    private Map<Long, BigDecimal> receivedQuantities(Long tenantId, Long purchaseOrderId) {
        Map<Long, BigDecimal> totals = new HashMap<>();
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        for (GoodsReceipt receipt : grnRepository.findByTenantIdAndPurchaseOrderId(effectiveTenantId, purchaseOrderId)) {
            for (GoodsReceiptItem item : receipt.getItems()) {
                totals.merge(item.getPurchaseOrderItemId(), item.getReceivedQuantity(), BigDecimal::add);
            }
        }
        return totals;
    }

    private void updatePurchaseOrderReceiptStatus(PurchaseOrder order, Long tenantId, LocalDate receiptDate) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        Map<Long, BigDecimal> totals = receivedQuantities(effectiveTenantId, order.getId());
        boolean hasReceipts = !totals.isEmpty();
        boolean complete = hasReceipts && order.getItems().stream()
                .allMatch(item -> totals.getOrDefault(item.getId(), BigDecimal.ZERO).compareTo(item.getQuantity()) >= 0);
        if (complete) {
            order.setStatus(PurchaseOrderStatus.COMPLETED);
            order.setActualDeliveryDate(receiptDate != null ? receiptDate : order.getActualDeliveryDate());
        } else if (hasReceipts) {
            order.setStatus(PurchaseOrderStatus.IN_PROGRESS);
            order.setActualDeliveryDate(null);
        } else {
            order.setStatus(PurchaseOrderStatus.CONFIRMED);
            order.setActualDeliveryDate(null);
        }
        purchaseOrderRepository.save(order);
    }

    private GoodsReceipt requireGrn(Long tenantId, Long id) {
        Long effectiveTenantId = tenantId != null ? tenantId : 1L;
        return grnRepository.findByIdAndTenantId(id, effectiveTenantId)
                .or(() -> grnRepository.findById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Goods receipt not found: " + id));
    }

    private BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
