package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.response.ReplenishmentRecommendationResponse;
import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.enums.InventoryItemStatus;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.service.ReplenishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReplenishmentServiceImpl implements ReplenishmentService {
	private final InventoryItemRepository itemRepository;

	public ReplenishmentServiceImpl(InventoryItemRepository itemRepository) {
		this.itemRepository = itemRepository;
	}

	@Override
	public List<ReplenishmentRecommendationResponse> recommendations(Long tenantId) {
		List<InventoryItem> items = itemRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);

		return items.stream()
				.filter(this::needsReplenishment)
				.map(this::toRecommendation)
				.toList();
	}

	private boolean needsReplenishment(InventoryItem item) {
		BigDecimal qty = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ZERO;
		BigDecimal minLevel = item.getMinimumLevel() != null ? item.getMinimumLevel() : BigDecimal.ZERO;
		return qty.compareTo(minLevel) < 0 || qty.signum() == 0;
	}

	private ReplenishmentRecommendationResponse toRecommendation(InventoryItem item) {
		BigDecimal qty = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ZERO;
		BigDecimal minLevel = item.getMinimumLevel() != null ? item.getMinimumLevel() : BigDecimal.ZERO;
		BigDecimal costPrice = item.getCostPrice() != null ? item.getCostPrice() : BigDecimal.ZERO;

		// Calculate suggested quantity: restore safety stock (e.g., target 2x minimum level, at least minLevel)
		BigDecimal target = minLevel.multiply(BigDecimal.valueOf(2));
		BigDecimal suggested = target.subtract(qty);
		if (suggested.compareTo(BigDecimal.TEN) < 0) {
			suggested = minLevel.max(BigDecimal.TEN);
		}

		BigDecimal estimatedCost = suggested.multiply(costPrice);

		String status;
		String urgency;
		if (qty.signum() == 0) {
			status = "OUT OF STOCK";
			urgency = "CRITICAL";
		} else if (qty.compareTo(minLevel.divide(BigDecimal.valueOf(2), 3, java.math.RoundingMode.HALF_UP)) < 0) {
			status = "LOW STOCK";
			urgency = "HIGH";
		} else {
			status = "LOW STOCK";
			urgency = "MEDIUM";
		}

		String supplier = "Primary Supplier (" + item.getCategory() + ")";

		return new ReplenishmentRecommendationResponse(
				item.getId(),
				item.getSku(),
				item.getName(),
				item.getCategory(),
				item.getWarehouseCode(),
				item.getWarehouseName(),
				qty,
				minLevel,
				suggested,
				item.getUnit(),
				costPrice,
				estimatedCost,
				status,
				urgency,
				supplier
		);
	}
}
