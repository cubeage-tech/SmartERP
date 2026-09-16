package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.request.CreateStockTakeRequest;
import com.cubeage.erp.inventory.dto.request.StockTakeItemRequest;
import com.cubeage.erp.inventory.dto.request.UpdateStockTakeRequest;
import com.cubeage.erp.inventory.dto.response.StockTakeItemResponse;
import com.cubeage.erp.inventory.dto.response.StockTakeResponse;
import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.entity.StockMovement;
import com.cubeage.erp.inventory.entity.StockTake;
import com.cubeage.erp.inventory.entity.StockTakeItem;
import com.cubeage.erp.inventory.enums.StockMovementType;
import com.cubeage.erp.inventory.enums.StockTakeStatus;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.repository.StockMovementRepository;
import com.cubeage.erp.inventory.repository.StockTakeItemRepository;
import com.cubeage.erp.inventory.repository.StockTakeRepository;
import com.cubeage.erp.inventory.service.StockTakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class StockTakeServiceImpl implements StockTakeService {
	private final StockTakeRepository stockTakeRepository;
	private final StockTakeItemRepository stockTakeItemRepository;
	private final InventoryItemRepository inventoryItemRepository;
	private final StockMovementRepository stockMovementRepository;

	public StockTakeServiceImpl(StockTakeRepository stockTakeRepository,
								StockTakeItemRepository stockTakeItemRepository,
								InventoryItemRepository inventoryItemRepository,
								StockMovementRepository stockMovementRepository) {
		this.stockTakeRepository = stockTakeRepository;
		this.stockTakeItemRepository = stockTakeItemRepository;
		this.inventoryItemRepository = inventoryItemRepository;
		this.stockMovementRepository = stockMovementRepository;
	}

	@Override
	public StockTakeResponse create(Long tenantId, CreateStockTakeRequest request) {
		String code = "ST-" + (System.currentTimeMillis() % 1000000);

		StockTake stockTake = StockTake.builder()
				.tenantId(tenantId)
				.code(code)
				.title(request.title().trim())
				.warehouseCode(request.warehouseCode().trim())
				.warehouseName(request.warehouseName().trim())
				.status(StockTakeStatus.DRAFT)
				.scheduledDate(request.scheduledDate() != null ? request.scheduledDate() : LocalDate.now())
				.notes(request.notes())
				.items(new ArrayList<>())
				.build();

		StockTake savedTake = stockTakeRepository.save(stockTake);

		// Find items to audit in the specified warehouse
		List<InventoryItem> warehouseItems = inventoryItemRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
				.filter(it -> it.getWarehouseCode().equalsIgnoreCase(request.warehouseCode().trim()))
				.toList();

		if (request.itemIds() != null && !request.itemIds().isEmpty()) {
			Set<Long> allowedIds = new HashSet<>(request.itemIds());
			warehouseItems = warehouseItems.stream().filter(it -> allowedIds.contains(it.getId())).toList();
		}

		List<StockTakeItem> takeItems = new ArrayList<>();
		for (InventoryItem invItem : warehouseItems) {
			StockTakeItem item = StockTakeItem.builder()
					.tenantId(tenantId)
					.stockTake(savedTake)
					.itemId(invItem.getId())
					.sku(invItem.getSku())
					.itemName(invItem.getName())
					.unit(invItem.getUnit())
					.systemQuantity(invItem.getQuantity() != null ? invItem.getQuantity() : BigDecimal.ZERO)
					.countedQuantity(null)
					.variance(BigDecimal.ZERO)
					.build();
			takeItems.add(item);
		}

		savedTake.getItems().addAll(takeItems);
		StockTake finalTake = stockTakeRepository.save(savedTake);
		return toResponse(finalTake);
	}

	@Override
	@Transactional(readOnly = true)
	public List<StockTakeResponse> all(Long tenantId) {
		return stockTakeRepository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
				.map(this::toResponse)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public StockTakeResponse get(Long tenantId, Long id) {
		StockTake take = stockTakeRepository.findByIdAndTenantId(id, tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Stock take not found: " + id));
		return toResponse(take);
	}

	@Override
	public StockTakeResponse update(Long tenantId, Long id, UpdateStockTakeRequest request) {
		StockTake take = stockTakeRepository.findByIdAndTenantId(id, tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Stock take not found: " + id));

		if (take.getStatus() == StockTakeStatus.COMPLETED) {
			throw new IllegalStateException("Cannot modify a finalized stock take");
		}

		if (request.title() != null && !request.title().isBlank()) {
			take.setTitle(request.title().trim());
		}
		if (request.notes() != null) {
			take.setNotes(request.notes().trim());
		}

		if (request.items() != null && !request.items().isEmpty()) {
			Map<Long, StockTakeItemRequest> requestItemMap = new HashMap<>();
			for (StockTakeItemRequest ir : request.items()) {
				requestItemMap.put(ir.id(), ir);
			}

			for (StockTakeItem item : take.getItems()) {
				StockTakeItemRequest ir = requestItemMap.get(item.getId());
				if (ir != null && ir.countedQuantity() != null) {
					item.setCountedQuantity(ir.countedQuantity());
					item.setVariance(ir.countedQuantity().subtract(item.getSystemQuantity()));
					if (ir.notes() != null) {
						item.setNotes(ir.notes().trim());
					}
				}
			}

			if (take.getStatus() == StockTakeStatus.DRAFT) {
				take.setStatus(StockTakeStatus.IN_PROGRESS);
			}
		}

		StockTake saved = stockTakeRepository.save(take);
		return toResponse(saved);
	}

	@Override
	public StockTakeResponse finalizeStockTake(Long tenantId, Long id) {
		StockTake take = stockTakeRepository.findByIdAndTenantId(id, tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Stock take not found: " + id));

		if (take.getStatus() == StockTakeStatus.COMPLETED) {
			throw new IllegalStateException("Stock take is already completed");
		}

		take.setStatus(StockTakeStatus.COMPLETED);
		take.setCompletedDate(LocalDate.now());

		// Adjust inventory quantities and write movement audit logs
		for (StockTakeItem item : take.getItems()) {
			if (item.getCountedQuantity() != null && item.getItemId() != null) {
				BigDecimal diff = item.getVariance() != null ? item.getVariance() : BigDecimal.ZERO;

				inventoryItemRepository.findByIdAndTenantId(item.getItemId(), tenantId).ifPresent(invItem -> {
					invItem.setQuantity(item.getCountedQuantity());
					inventoryItemRepository.save(invItem);

					if (diff.compareTo(BigDecimal.ZERO) != 0) {
						StockMovement movement = StockMovement.builder()
								.tenantId(tenantId)
								.sku(invItem.getSku())
								.itemName(invItem.getName())
								.type(diff.compareTo(BigDecimal.ZERO) > 0 ? StockMovementType.STOCK_IN : StockMovementType.STOCK_OUT)
								.quantity(diff.abs())
								.unit(invItem.getUnit())
								.warehouseCode(take.getWarehouseCode())
								.warehouseName(take.getWarehouseName())
								.reference("STOCK TAKE: " + take.getCode())
								.movementDate(LocalDate.now())
								.build();
						stockMovementRepository.save(movement);
					}
				});
			}
		}

		StockTake saved = stockTakeRepository.save(take);
		return toResponse(saved);
	}

	private StockTakeResponse toResponse(StockTake take) {
		List<StockTakeItemResponse> itemResponses = take.getItems() != null ? take.getItems().stream()
				.map(it -> new StockTakeItemResponse(
						it.getId(),
						it.getItemId(),
						it.getSku(),
						it.getItemName(),
						it.getUnit(),
						it.getSystemQuantity(),
						it.getCountedQuantity(),
						it.getVariance(),
						it.getNotes()
				)).toList() : Collections.emptyList();

		int total = itemResponses.size();
		int matched = 0;
		int variance = 0;

		for (StockTakeItemResponse ir : itemResponses) {
			if (ir.countedQuantity() != null) {
				if (ir.variance() != null && ir.variance().compareTo(BigDecimal.ZERO) == 0) {
					matched++;
				} else if (ir.variance() != null && ir.variance().compareTo(BigDecimal.ZERO) != 0) {
					variance++;
				}
			}
		}

		return new StockTakeResponse(
				take.getId(),
				take.getCode(),
				take.getTitle(),
				take.getWarehouseCode(),
				take.getWarehouseName(),
				take.getStatus(),
				take.getScheduledDate(),
				take.getCompletedDate(),
				take.getNotes(),
				total,
				matched,
				variance,
				itemResponses
		);
	}
}
