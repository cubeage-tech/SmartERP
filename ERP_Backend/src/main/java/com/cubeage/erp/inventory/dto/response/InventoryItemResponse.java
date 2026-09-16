package com.cubeage.erp.inventory.dto.response;

import com.cubeage.erp.inventory.entity.InventoryItem;
import com.cubeage.erp.inventory.enums.InventoryItemStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InventoryItemResponse(
	Long id,
	String sku,
	String name,
	String itemType,
	String category,
	String subCategory,
	String barcode,
	String hsnSacCode,
	String description,

	String unit,
	String purchaseUnit,
	String salesUnit,
	String stockUnit,
	BigDecimal conversionFactor,

	String warehouseCode,
	String warehouseName,
	String storageLocation,
	BigDecimal quantity,
	BigDecimal minimumLevel,
	BigDecimal maximumStockLevel,
	BigDecimal reorderLevel,
	BigDecimal reorderQuantity,

	BigDecimal costPrice,
	BigDecimal sellingPrice,
	String costingMethod,
	BigDecimal taxRate,
	BigDecimal stockValue,
	String status,

	String primarySupplier,
	String supplierItemCode,
	Integer leadTime,
	Boolean preferredSupplier,

	Boolean taxableItem,
	BigDecimal gstRate,
	BigDecimal cgst,
	BigDecimal sgst,
	BigDecimal igst,
	String taxHsnCode,

	Boolean trackInventory,
	Boolean trackBatch,
	Boolean trackSerialNumber,
	Boolean lowStockAlert,
	Boolean autoReorder,
	Boolean allowNegativeStock,

	Boolean batchTracking,
	Boolean expiryTracking,
	Integer shelfLife,
	LocalDate manufacturingDate,
	LocalDate expiryDate,
	String batchPrefix,

	BigDecimal length,
	BigDecimal width,
	BigDecimal thickness,
	BigDecimal weight,
	String gradeModel,
	String specification,

	String attachmentsJson,
	String internalNotes,
	String additionalNotes
) {
	public static InventoryItemResponse from(InventoryItem item) {
		if (item == null) return null;
		BigDecimal qty = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ZERO;
		BigDecimal cost = item.getCostPrice() != null ? item.getCostPrice() : BigDecimal.ZERO;
		BigDecimal min = item.getMinimumLevel() != null ? item.getMinimumLevel() : BigDecimal.ZERO;

		String derivedStatus = qty.signum() == 0 ? "OUT OF STOCK"
				: (qty.compareTo(min) < 0 ? "LOW STOCK" : "IN STOCK");

		return new InventoryItemResponse(
				item.getId(),
				item.getSku(),
				item.getName(),
				item.getItemType(),
				item.getCategory(),
				item.getSubCategory(),
				item.getBarcode(),
				item.getHsnSacCode(),
				item.getDescription(),

				item.getUnit(),
				item.getPurchaseUnit(),
				item.getSalesUnit(),
				item.getStockUnit(),
				item.getConversionFactor(),

				item.getWarehouseCode(),
				item.getWarehouseName(),
				item.getStorageLocation(),
				qty,
				item.getMinimumLevel(),
				item.getMaximumStockLevel(),
				item.getReorderLevel(),
				item.getReorderQuantity(),

				cost,
				item.getSellingPrice(),
				item.getCostingMethod(),
				item.getTaxRate(),
				qty.multiply(cost),
				derivedStatus,

				item.getPrimarySupplier(),
				item.getSupplierItemCode(),
				item.getLeadTime(),
				item.getPreferredSupplier(),

				item.getTaxableItem(),
				item.getGstRate(),
				item.getCgst(),
				item.getSgst(),
				item.getIgst(),
				item.getTaxHsnCode(),

				item.getTrackInventory(),
				item.getTrackBatch(),
				item.getTrackSerialNumber(),
				item.getLowStockAlert(),
				item.getAutoReorder(),
				item.getAllowNegativeStock(),

				item.getBatchTracking(),
				item.getExpiryTracking(),
				item.getShelfLife(),
				item.getManufacturingDate(),
				item.getExpiryDate(),
				item.getBatchPrefix(),

				item.getLength(),
				item.getWidth(),
				item.getThickness(),
				item.getWeight(),
				item.getGradeModel(),
				item.getSpecification(),

				item.getAttachmentsJson(),
				item.getInternalNotes(),
				item.getAdditionalNotes()
		);
	}
}
