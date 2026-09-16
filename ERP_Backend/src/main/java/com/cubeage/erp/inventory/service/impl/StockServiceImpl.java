package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.request.StockAdjustmentRequest;
import com.cubeage.erp.inventory.dto.request.StockTransferRequest;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;
import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.entity.StockMovement;
import com.cubeage.erp.inventory.enums.InventoryItemStatus;
import com.cubeage.erp.inventory.enums.StockMovementType;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.repository.StockMovementRepository;
import com.cubeage.erp.inventory.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Locale;

@Service
@Transactional
public class StockServiceImpl implements StockService {
	private final InventoryItemRepository itemRepository;
	private final StockMovementRepository movementRepository;

	public StockServiceImpl(InventoryItemRepository itemRepository, StockMovementRepository movementRepository) {
		this.itemRepository = itemRepository;
		this.movementRepository = movementRepository;
	}

	@Override
	public InventoryItemResponse adjustStock(Long tenantId, StockAdjustmentRequest request) {
		InventoryItem item = itemRepository.findByIdAndTenantId(request.itemId(), tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + request.itemId()));

		BigDecimal oldQty = item.getQuantity();
		BigDecimal newQty = request.newQuantity();
		if (newQty.compareTo(BigDecimal.ZERO) < 0) {
			throw new IllegalArgumentException("Adjusted stock quantity cannot be negative");
		}

		BigDecimal diff = newQty.subtract(oldQty);
		item.setQuantity(newQty);
		InventoryItem saved = itemRepository.save(item);

		if (diff.compareTo(BigDecimal.ZERO) != 0) {
			StockMovement movement = StockMovement.builder()
					.tenantId(tenantId)
					.sku(item.getSku())
					.itemName(item.getName())
					.type(diff.compareTo(BigDecimal.ZERO) > 0 ? StockMovementType.STOCK_IN : StockMovementType.STOCK_OUT)
					.quantity(diff.abs())
					.unit(item.getUnit())
					.warehouseCode(item.getWarehouseCode())
					.warehouseName(item.getWarehouseName())
					.reference((request.reference() != null && !request.reference().isBlank())
							? request.reference().trim()
							: ("ADJUSTMENT: " + request.reason().trim()))
					.movementDate(LocalDate.now())
					.build();
			movementRepository.save(movement);
		}

		return InventoryItemResponse.from(saved);
	}

	@Override
	public InventoryItemResponse transferStock(Long tenantId, StockTransferRequest request) {
		InventoryItem source = itemRepository.findByIdAndTenantId(request.itemId(), tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Source inventory item not found: " + request.itemId()));

		BigDecimal transferQty = request.quantity();
		if (transferQty.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Transfer quantity must be greater than zero");
		}

		if (source.getQuantity().compareTo(transferQty) < 0) {
			throw new IllegalArgumentException("Insufficient stock in source warehouse: available "
					+ source.getQuantity() + " " + source.getUnit() + ", requested " + transferQty);
		}

		String targetWhCode = request.targetWarehouseCode().trim().toUpperCase(Locale.ROOT);
		String targetWhName = request.targetWarehouseName().trim();

		if (source.getWarehouseCode().equalsIgnoreCase(targetWhCode)) {
			throw new IllegalArgumentException("Source and destination warehouses must be different");
		}

		String sourceWhCode = source.getWarehouseCode();
		String sourceWhName = source.getWarehouseName();

		// Update item warehouse to destination warehouse
		source.setWarehouseCode(targetWhCode);
		source.setWarehouseName(targetWhName);
		InventoryItem savedSource = itemRepository.save(source);

		// Record transfer movements
		String ref = (request.reference() != null && !request.reference().isBlank())
				? request.reference().trim()
				: ("TRANSFER: " + sourceWhCode + " -> " + targetWhCode);

		StockMovement outMovement = StockMovement.builder()
				.tenantId(tenantId)
				.sku(source.getSku())
				.itemName(source.getName())
				.type(StockMovementType.TRANSFER)
				.quantity(transferQty)
				.unit(source.getUnit())
				.warehouseCode(sourceWhCode)
				.warehouseName(sourceWhName)
				.reference(ref + " (OUT)")
				.movementDate(LocalDate.now())
				.build();
		movementRepository.save(outMovement);

		StockMovement inMovement = StockMovement.builder()
				.tenantId(tenantId)
				.sku(source.getSku())
				.itemName(source.getName())
				.type(StockMovementType.TRANSFER)
				.quantity(transferQty)
				.unit(source.getUnit())
				.warehouseCode(targetWhCode)
				.warehouseName(targetWhName)
				.reference(ref + " (IN)")
				.movementDate(LocalDate.now())
				.build();
		movementRepository.save(inMovement);

		return InventoryItemResponse.from(savedSource);
	}
}
