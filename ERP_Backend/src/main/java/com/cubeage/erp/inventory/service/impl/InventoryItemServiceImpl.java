package com.cubeage.erp.inventory.service.impl;

import com.cubeage.erp.inventory.dto.request.CreateInventoryItemRequest;
import com.cubeage.erp.inventory.dto.request.UpdateInventoryItemRequest;
import com.cubeage.erp.inventory.dto.response.InventoryItemResponse;
import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.enums.InventoryItemStatus;
import com.cubeage.erp.inventory.repository.InventoryItemRepository;
import com.cubeage.erp.inventory.service.InventoryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class InventoryItemServiceImpl implements InventoryItemService {
	private final InventoryItemRepository repository;

	public InventoryItemServiceImpl(InventoryItemRepository repository) {
		this.repository = repository;
	}

	@Override
	public InventoryItemResponse create(Long tenantId, CreateInventoryItemRequest request) {
		if (repository.findByTenantIdAndSkuIgnoreCase(tenantId, request.sku().trim()).isPresent()) {
			throw new IllegalArgumentException("SKU already exists: " + request.sku());
		}

		validateDates(request.manufacturingDate(), request.expiryDate(), request.shelfLife());

		BigDecimal gstRate = request.gstRate() != null ? request.gstRate() : BigDecimal.valueOf(18);
		BigDecimal halfGst = gstRate.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);

		InventoryItem item = InventoryItem.builder()
				.tenantId(tenantId)
				// 1. Basic
				.sku(request.sku().trim().toUpperCase(Locale.ROOT))
				.name(request.name().trim())
				.itemType(request.itemType() != null ? request.itemType().trim() : "Raw Material")
				.category(request.category().trim())
				.subCategory(request.subCategory() != null ? request.subCategory().trim() : null)
				.barcode(request.barcode() != null ? request.barcode().trim() : null)
				.hsnSacCode(request.hsnSacCode() != null ? request.hsnSacCode().trim() : null)
				.description(request.description() != null ? request.description().trim() : null)

				// 2. Units
				.unit(request.unit().trim())
				.purchaseUnit(request.purchaseUnit() != null ? request.purchaseUnit().trim() : request.unit().trim())
				.salesUnit(request.salesUnit() != null ? request.salesUnit().trim() : request.unit().trim())
				.stockUnit(request.stockUnit() != null ? request.stockUnit().trim() : request.unit().trim())
				.conversionFactor(request.conversionFactor() != null ? request.conversionFactor() : BigDecimal.ONE)

				// 3. Warehouse & Stock
				.warehouseCode(request.warehouseCode().trim())
				.warehouseName(request.warehouseName().trim())
				.storageLocation(request.storageLocation() != null ? request.storageLocation().trim() : null)
				.quantity(request.quantity())
				.minimumLevel(request.minimumLevel())
				.maximumStockLevel(request.maximumStockLevel() != null ? request.maximumStockLevel() : BigDecimal.ZERO)
				.reorderLevel(request.reorderLevel() != null ? request.reorderLevel() : BigDecimal.ZERO)
				.reorderQuantity(request.reorderQuantity() != null ? request.reorderQuantity() : BigDecimal.ZERO)

				// 4. Pricing
				.costPrice(request.costPrice())
				.sellingPrice(request.sellingPrice() != null ? request.sellingPrice() : BigDecimal.ZERO)
				.costingMethod(request.costingMethod() != null ? request.costingMethod().trim() : "Weighted Average Cost")
				.taxRate(request.taxRate() != null ? request.taxRate() : gstRate)

				// 5. Supplier
				.primarySupplier(request.primarySupplier() != null ? request.primarySupplier().trim() : null)
				.supplierItemCode(request.supplierItemCode() != null ? request.supplierItemCode().trim() : null)
				.leadTime(request.leadTime() != null ? request.leadTime() : 7)
				.preferredSupplier(request.preferredSupplier() != null ? request.preferredSupplier() : true)

				// 6. Tax
				.taxableItem(request.taxableItem() != null ? request.taxableItem() : true)
				.gstRate(gstRate)
				.cgst(request.cgst() != null ? request.cgst() : halfGst)
				.sgst(request.sgst() != null ? request.sgst() : halfGst)
				.igst(request.igst() != null ? request.igst() : gstRate)
				.taxHsnCode(request.taxHsnCode() != null ? request.taxHsnCode().trim() : request.hsnSacCode())

				// 7. Stock Control
				.trackInventory(request.trackInventory() != null ? request.trackInventory() : true)
				.trackBatch(request.trackBatch() != null ? request.trackBatch() : false)
				.trackSerialNumber(request.trackSerialNumber() != null ? request.trackSerialNumber() : false)
				.lowStockAlert(request.lowStockAlert() != null ? request.lowStockAlert() : true)
				.autoReorder(request.autoReorder() != null ? request.autoReorder() : false)
				.allowNegativeStock(request.allowNegativeStock() != null ? request.allowNegativeStock() : false)

				// 8. Batch / Expiry
				.batchTracking(request.batchTracking() != null ? request.batchTracking() : false)
				.expiryTracking(request.expiryTracking() != null ? request.expiryTracking() : false)
				.shelfLife(request.shelfLife())
				.manufacturingDate(request.manufacturingDate())
				.expiryDate(request.expiryDate())
				.batchPrefix(request.batchPrefix() != null ? request.batchPrefix().trim() : "BAT-")

				// 9. Specifications
				.length(request.length())
				.width(request.width())
				.thickness(request.thickness())
				.weight(request.weight())
				.gradeModel(request.gradeModel() != null ? request.gradeModel().trim() : null)
				.specification(request.specification() != null ? request.specification().trim() : null)

				// 10. Attachments
				.attachmentsJson(request.attachmentsJson())

				// 11. Notes
				.internalNotes(request.internalNotes() != null ? request.internalNotes().trim() : null)
				.additionalNotes(request.additionalNotes() != null ? request.additionalNotes().trim() : null)
				.build();

		return response(repository.save(item));
	}

	@Override
	public InventoryItemResponse update(Long tenantId, Long id, UpdateInventoryItemRequest request) {
		InventoryItem item = entity(tenantId, id);

		validateDates(
				request.manufacturingDate() != null ? request.manufacturingDate() : item.getManufacturingDate(),
				request.expiryDate() != null ? request.expiryDate() : item.getExpiryDate(),
				request.shelfLife() != null ? request.shelfLife() : item.getShelfLife()
		);

		// 1. Basic
		if (request.name() != null) item.setName(request.name().trim());
		if (request.itemType() != null) item.setItemType(request.itemType().trim());
		if (request.category() != null) item.setCategory(request.category().trim());
		if (request.subCategory() != null) item.setSubCategory(request.subCategory().trim());
		if (request.barcode() != null) item.setBarcode(request.barcode().trim());
		if (request.hsnSacCode() != null) item.setHsnSacCode(request.hsnSacCode().trim());
		if (request.description() != null) item.setDescription(request.description().trim());

		// 2. Units
		if (request.unit() != null) item.setUnit(request.unit().trim());
		if (request.purchaseUnit() != null) item.setPurchaseUnit(request.purchaseUnit().trim());
		if (request.salesUnit() != null) item.setSalesUnit(request.salesUnit().trim());
		if (request.stockUnit() != null) item.setStockUnit(request.stockUnit().trim());
		if (request.conversionFactor() != null) item.setConversionFactor(request.conversionFactor());

		// 3. Warehouse & Stock
		if (request.warehouseCode() != null) item.setWarehouseCode(request.warehouseCode().trim());
		if (request.warehouseName() != null) item.setWarehouseName(request.warehouseName().trim());
		if (request.storageLocation() != null) item.setStorageLocation(request.storageLocation().trim());
		if (request.quantity() != null) item.setQuantity(request.quantity());
		if (request.minimumLevel() != null) item.setMinimumLevel(request.minimumLevel());
		if (request.maximumStockLevel() != null) item.setMaximumStockLevel(request.maximumStockLevel());
		if (request.reorderLevel() != null) item.setReorderLevel(request.reorderLevel());
		if (request.reorderQuantity() != null) item.setReorderQuantity(request.reorderQuantity());

		// 4. Pricing
		if (request.costPrice() != null) item.setCostPrice(request.costPrice());
		if (request.sellingPrice() != null) item.setSellingPrice(request.sellingPrice());
		if (request.costingMethod() != null) item.setCostingMethod(request.costingMethod().trim());
		if (request.taxRate() != null) item.setTaxRate(request.taxRate());

		// 5. Supplier
		if (request.primarySupplier() != null) item.setPrimarySupplier(request.primarySupplier().trim());
		if (request.supplierItemCode() != null) item.setSupplierItemCode(request.supplierItemCode().trim());
		if (request.leadTime() != null) item.setLeadTime(request.leadTime());
		if (request.preferredSupplier() != null) item.setPreferredSupplier(request.preferredSupplier());

		// 6. Tax
		if (request.taxableItem() != null) item.setTaxableItem(request.taxableItem());
		if (request.gstRate() != null) {
			item.setGstRate(request.gstRate());
			BigDecimal halfGst = request.gstRate().divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
			item.setCgst(request.cgst() != null ? request.cgst() : halfGst);
			item.setSgst(request.sgst() != null ? request.sgst() : halfGst);
			item.setIgst(request.igst() != null ? request.igst() : request.gstRate());
		}
		if (request.taxHsnCode() != null) item.setTaxHsnCode(request.taxHsnCode().trim());

		// 7. Stock Control
		if (request.trackInventory() != null) item.setTrackInventory(request.trackInventory());
		if (request.trackBatch() != null) item.setTrackBatch(request.trackBatch());
		if (request.trackSerialNumber() != null) item.setTrackSerialNumber(request.trackSerialNumber());
		if (request.lowStockAlert() != null) item.setLowStockAlert(request.lowStockAlert());
		if (request.autoReorder() != null) item.setAutoReorder(request.autoReorder());
		if (request.allowNegativeStock() != null) item.setAllowNegativeStock(request.allowNegativeStock());

		// 8. Batch / Expiry
		if (request.batchTracking() != null) item.setBatchTracking(request.batchTracking());
		if (request.expiryTracking() != null) item.setExpiryTracking(request.expiryTracking());
		if (request.shelfLife() != null) item.setShelfLife(request.shelfLife());
		if (request.manufacturingDate() != null) item.setManufacturingDate(request.manufacturingDate());
		if (request.expiryDate() != null) item.setExpiryDate(request.expiryDate());
		if (request.batchPrefix() != null) item.setBatchPrefix(request.batchPrefix().trim());

		// 9. Specifications
		if (request.length() != null) item.setLength(request.length());
		if (request.width() != null) item.setWidth(request.width());
		if (request.thickness() != null) item.setThickness(request.thickness());
		if (request.weight() != null) item.setWeight(request.weight());
		if (request.gradeModel() != null) item.setGradeModel(request.gradeModel().trim());
		if (request.specification() != null) item.setSpecification(request.specification().trim());

		// 10. Attachments
		if (request.attachmentsJson() != null) item.setAttachmentsJson(request.attachmentsJson());

		// 11. Notes
		if (request.internalNotes() != null) item.setInternalNotes(request.internalNotes().trim());
		if (request.additionalNotes() != null) item.setAdditionalNotes(request.additionalNotes().trim());

		return response(repository.save(item));
	}

	@Override
	@Transactional(readOnly = true)
	public InventoryItemResponse get(Long tenantId, Long id) {
		return response(entity(tenantId, id));
	}

	@Override
	@Transactional(readOnly = true)
	public List<InventoryItemResponse> all(Long tenantId, String search, String status) {
		String term = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
		String requestedStatus = status == null ? "" : status.trim().replace(' ', '_').toUpperCase(Locale.ROOT);
		return repository.findByTenantIdOrderByCreatedAtDesc(tenantId).stream()
				.filter(item -> term.isBlank() || item.getSku().toLowerCase(Locale.ROOT).contains(term)
						|| item.getName().toLowerCase(Locale.ROOT).contains(term)
						|| item.getCategory().toLowerCase(Locale.ROOT).contains(term)
						|| item.getWarehouseName().toLowerCase(Locale.ROOT).contains(term)
						|| (item.getPrimarySupplier() != null && item.getPrimarySupplier().toLowerCase(Locale.ROOT).contains(term)))
				.filter(item -> requestedStatus.isBlank() || status(item).name().equals(requestedStatus))
				.map(this::response).toList();
	}

	@Override
	public void delete(Long tenantId, Long id) {
		repository.delete(entity(tenantId, id));
	}

	private void validateDates(java.time.LocalDate mfg, java.time.LocalDate exp, Integer shelfLife) {
		if (mfg != null && exp != null && exp.isBefore(mfg)) {
			throw new IllegalArgumentException("Expiry date cannot be before manufacturing date");
		}
		if (shelfLife != null && shelfLife < 0) {
			throw new IllegalArgumentException("Shelf life must be non-negative");
		}
	}

	private InventoryItem entity(Long tenantId, Long id) {
		return repository.findByIdAndTenantId(id, tenantId)
				.orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + id));
	}

	private InventoryItemResponse response(InventoryItem item) {
		return InventoryItemResponse.from(item);
	}

	private InventoryItemStatus status(InventoryItem item) {
		BigDecimal qty = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ZERO;
		BigDecimal min = item.getMinimumLevel() != null ? item.getMinimumLevel() : BigDecimal.ZERO;
		if (qty.signum() == 0) return InventoryItemStatus.OUT_OF_STOCK;
		if (qty.compareTo(min) < 0) return InventoryItemStatus.LOW_STOCK;
		return InventoryItemStatus.IN_STOCK;
	}
}
